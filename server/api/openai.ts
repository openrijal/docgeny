import { ChatOpenAI } from "langchain/chat_models/openai";
import { HNSWLib } from "langchain/vectorstores/hnswlib";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { BufferMemory } from "langchain/memory";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import * as fs from "fs";
import { RunnableBranch, RunnableSequence } from "langchain/schema/runnable";
import { PromptTemplate } from "langchain/prompts";
import { StringOutputParser } from "langchain/schema/output_parser";
import { LLMChain } from "langchain/chains";
import { formatDocumentsAsString } from "langchain/util/document";

// Reference: https://js.langchain.com/docs/use_cases/question_answering/advanced_conversational_qa

export default eventHandler(async (event) => {
  const body = await readBody(event)

  /* Initialize the LLM to use to answer the question */
  const model = new ChatOpenAI({});
 
  /* Load in the file(s) we want to do question answering over */
  // const text = fs.readFileSync("[all files from the user context]", "utf8");
  // read the text from the files, somehow tag them as separate entity
  // create embeddings as needed
  
  /* Split the text into chunks */
  // const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000 }); // todo: needs a proper splitter
  // const docs = await textSplitter.createDocuments([text]);
  /* Create the vectorstore */
  // const vectorStore = await HNSWLib.fromDocuments(docs, new OpenAIEmbeddings());
  // const retriever = vectorStore.asRetriever();

  // todo: replace this mock vector store with real vector store as needed
  const vectorStore = await MemoryVectorStore.fromTexts(
    ["Hello world", "Bye bye", "hello nice world"],
    [{ id: 2 }, { id: 1 }, { id: 3 }],
    new OpenAIEmbeddings()
  );
  const retriever = vectorStore.asRetriever();

  /* Create a template for the sections */
  const template = `Use the following pieces of context to answer the question at the end.
                    If you cannot generate a useful answer, just say that you were not able to generate an answer, don't try to make up an answer.
                    Use three paragraphs maximum and each paragraph may have upto 5 simple sentences.
                    Keep the answer professional and as technical to the subject as possible.
                    Always say thanks, that's all I have" at the end of the answer.
                    ----------------
                    CHAT HISTORY: {chatHistory}
                    ----------------
                    CONTEXT: {context}
                    ----------------
                    QUESTION: {question}
                    ----------------
                    Helpful Answer:`;

  const serializeChatHistory = (chatHistory: string | Array<string>) => {
    if (Array.isArray(chatHistory)) {
      return chatHistory.join("\n");
    }
    return chatHistory;
  };

  const memory = new BufferMemory({
    memoryKey: "chatHistory", // todo: make this unique for this user session
  });
  
  /**
   * Create a prompt template for generating an answer based on context and
   * a question.
   *
   * Chat history will be an empty string if it's the first question.
   *
   * inputVariables: ["chatHistory", "context", "question"]
   */
  const questionPrompt = PromptTemplate.fromTemplate(
    `Use the following pieces of context to answer the question at the end. If you don't know the answer, just say that you don't know, don't try to make up an answer.
      ----------------
      CHAT HISTORY: {chatHistory}
      ----------------
      CONTEXT: {context}
      ----------------
      QUESTION: {question}
      ----------------
      Helpful Answer:`
  );

  /**
   * Creates a prompt template for __generating a question__ to then ask an LLM
   * based on previous chat history, context and the question.
   *
   * inputVariables: ["chatHistory", "question"]
   */
  const questionGeneratorTemplate =
    PromptTemplate.fromTemplate(`Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question.
                                  ----------------
                                  CHAT HISTORY: {chatHistory}
                                  ----------------
                                  FOLLOWUP QUESTION: {question}
                                  ----------------
                                  Standalone question:`
    );

  const handleProcessQuery = async (input: {
    question: string;
    context: string;
    chatHistory?: string | Array<string>;
  }) => {
    const chain = new LLMChain({
      llm: model,
      prompt: questionPrompt,
      outputParser: new StringOutputParser(),
    });

    const { text } = await chain.call({
      ...input,
      chatHistory: serializeChatHistory(input.chatHistory ?? ""),
    });

    await memory.saveContext(
      {
        human: input.question,
      },
      {
        ai: text,
      }
    );

    return text;
  };

  const answerQuestionChain = RunnableSequence.from([
    {
      question: (input: {
        question: string;
        chatHistory?: string | Array<string>;
      }) => input.question,
    },
    {
      question: (previousStepResult: {
        question: string;
        chatHistory?: string | Array<string>;
      }) => previousStepResult.question,
      chatHistory: (previousStepResult: {
        question: string;
        chatHistory?: string | Array<string>;
      }) => serializeChatHistory(previousStepResult.chatHistory ?? ""),
      context: async (previousStepResult: {
        question: string;
        chatHistory?: string | Array<string>;
      }) => {
        // Fetch relevant docs and serialize to a string.
        const relevantDocs = await retriever.getRelevantDocuments(
          previousStepResult.question
        );
        const serialized = formatDocumentsAsString(relevantDocs);
        return serialized;
      },
    },
    handleProcessQuery,
  ]);

  const generateQuestionChain = RunnableSequence.from([
    {
      question: (input: {
        question: string;
        chatHistory: string | Array<string>;
      }) => input.question,
      chatHistory: async () => {
        const memoryResult = await memory.loadMemoryVariables({});
        return serializeChatHistory(memoryResult.chatHistory ?? "");
      },
    },
    questionGeneratorTemplate,
    model,
    // Take the result of the above model call, and pass it through to the
    // next RunnableSequence chain which will answer the question
    {
      question: (previousStepResult: { text: string }) =>
        previousStepResult.text,
    },
    answerQuestionChain,
  ]);

  const branch = RunnableBranch.from([
    [
      async () => {
        const memoryResult = await memory.loadMemoryVariables({});
        const isChatHistoryPresent = !memoryResult.chatHistory.length;

        return isChatHistoryPresent;
      },
      answerQuestionChain,
    ],
    [
      async () => {
        const memoryResult = await memory.loadMemoryVariables({});
        const isChatHistoryPresent =
          !!memoryResult.chatHistory && memoryResult.chatHistory.length;

        return isChatHistoryPresent;
      },
      generateQuestionChain,
    ],
    answerQuestionChain,
  ]);

  /* Define our chain which calls the branch with our input. */
  const fullChain = RunnableSequence.from([
    {
      question: (input: { question: string }) => input.question,
    },
    branch,
  ]);

  
  /* Generate responses for each section */

  // todo: make use of a loop instead
  const sectionOneResult = await fullChain.invoke({
    question: "body.section1.heading",
  });

  console.log({ sectionOneResult });

  const sectionTwoResult = await fullChain.invoke({
    question: "body.section2.heading",
  });

  console.log({ sectionTwoResult });
  
})
