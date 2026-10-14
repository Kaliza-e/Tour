import { POST as claimQuestion } from "../claim/route";

export const dynamic = "force-dynamic";

export async function POST(
  request: Request,
  context: { params: { id: string } }
) {
  return claimQuestion(request, context);
}
