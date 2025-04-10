import { authOptions } from "../../../app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { pusherServer } from "@/lib/Pusher";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const session = await getServerSession(request, response, authOptions);
  
  if (!session?.user?.email) {
    return response.status(401).json({ message: "Unauthorized" });
  }

  const { socket_id: socketId, channel_name: channel } = request.body;

  if (!socketId || !channel) {
    return response.status(400).json({ 
      message: "Missing socket_id or channel_name in request body" 
    });
  }

  const data = {
    user_id: session.user.email
  };

  try {
    const authResponse = pusherServer.authorizeChannel(socketId, channel, data);
    return response.send(authResponse);
  } catch (error) {
    console.error("Pusher auth error:", error);
    return response.status(500).json({ message: "Internal server error" });
  }
}