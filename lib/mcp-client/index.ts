import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import Anthropic from "@anthropic-ai/sdk";
import dotenv from "dotenv";

dotenv.config();

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const MODEL_NAME = "claude-sonnet-4-20250514";

if (!ANTHROPIC_API_KEY) throw new Error("ANTHROPIC_API_KEY is not set");

const anthropic = new Anthropic({
  apiKey: ANTHROPIC_API_KEY,
});
const mcp = new Client({ name: "nextjs-mcp-client", version: "1.0.0" });

import { MessageCreateParams } from "@anthropic-ai/sdk/resources/messages";

type AnthropicTool = NonNullable<MessageCreateParams["tools"]>[number];
let tools: AnthropicTool[] = [];

let connected = false;

export async function initMCP(serverScriptPath: string) {
  if (connected) return;

  const command = serverScriptPath.endsWith(".py")
    ? process.platform === "win32"
      ? "python"
      : "python3"
    : "D:/mcp-boards/go-ai/mcp/main.exe";

  const transport = new StdioClientTransport({
    command,
    args: [],
  });

  await mcp.connect(transport);

  const toolsResult = await mcp.listTools();

  tools = toolsResult.tools.map((tool) => ({
    type: "custom" as const,
    name: tool.name,
    description: tool.description || "",
    input_schema: {
      type: "object",
      properties: tool.inputSchema.properties || {},
      required: tool.inputSchema.required || [],
    },
  }));

  if (!tools || tools.length === 0) {
    console.warn("MCP returned no tools. Verify the MCP server is running and exposes tools.");
    throw new Error("No MCP tools loaded");
  }

  connected = true;
  console.log(
    "MCP Connected with tools:",
    tools,
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function executeToolCall(toolCall: any) {
  const toolName = toolCall.function?.name ?? toolCall.name;
  const rawArgs = toolCall.function?.arguments ?? toolCall.input;
  const toolArgs = typeof rawArgs === "string" ? (JSON.parse(rawArgs || "{}")) : (rawArgs || {});

  console.log("toolName", toolName);
  console.log("toolArgs", toolArgs);

  const result = await mcp.callTool({
    name: toolName,
    arguments: toolArgs,
  });

  return {
    id: toolCall.id,
    name: toolName,
    arguments: toolArgs,
    result: result.content,
  };
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export async function processQuery(messagesInput: Message[]) {
  const messages: Anthropic.Messages.MessageParam[] = [
    {
      role: "assistant",
      content: "You are a helpful assistant that can use tools.",
    },
    ...messagesInput.map(msg => ({
      role: msg.role,
      content: msg.content,
    })),
  ];

  const response = await anthropic.messages.create({
    model: MODEL_NAME,
    max_tokens: 1000,
    messages,
    tools,
    tool_choice: { type: "auto" },
  });

  const textContent = response.content.find(block => block.type === 'text');
  const toolUseBlocks = response.content.filter(block => block.type === 'tool_use');

  if (toolUseBlocks.length > 0) {
    const toolResponses = [];

    // First, append the assistant message that contains tool_use blocks
    messages.push({
      role: "assistant",
      content: response.content as any,
    } as any);

    // Execute all tool calls and aggregate tool_result blocks
    const toolResultBlocks: any[] = [];
    for (const block of toolUseBlocks) {
      const toolUse = block as any; // { type: 'tool_use', id, name, input }
      const toolResponse = await executeToolCall({
        id: toolUse.id,
        name: toolUse.name,
        input: toolUse.input,
      });
      toolResponses.push(toolResponse);
      toolResultBlocks.push({
        type: "tool_result",
        tool_use_id: toolUse.id,
        content: JSON.stringify(toolResponse.result ?? "", null, 2),
      });
    }

    // Then append a single user message with all tool_result blocks
    messages.push({
      role: "user",
      content: toolResultBlocks as any,
    } as any);

    const followUp = await anthropic.messages.create({
      model: MODEL_NAME,
      max_tokens: 1000,
      messages,
      tools,
      tool_choice: { type: "auto" },
    });

    const followUpText = followUp.content.find(block => block.type === 'text');
    
    return {
      reply: followUpText?.text || "",
      toolCalls: toolUseBlocks,
      toolResponses,
    };
  }

  return {
    reply: textContent?.text || "",
    toolCalls: [],
    toolResponses: [],
  };
}