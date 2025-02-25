import { NextResponse } from "next/server";
import { getOpenAIClient } from "@/lib/openai";
import { analyze, getChatResponse } from "@/actions/chat";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const openai = getOpenAIClient();

    const response = await analyze(openai, body.image1, body.image2);

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const openai = getOpenAIClient();

    const response = await getChatResponse(
      openai,
      body.messages,
      body.conversationId
    );

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
