import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { ChannelType } from "@prisma/client";

import { db } from "@/lib/db";
import { currentProfile } from "@/lib/current-profile";
import { ChatHeader } from "@/components/chat/chat-header";

interface ChannelIdPageProps {
	params: {
		serverId: string;
		channelId: string;
	};
}

const ChannelIdPage = async (props: ChannelIdPageProps) => {

	const profile = await currentProfile();
	if (!profile) return redirectToSignIn();

	const channel = await db.channel.findUnique({
		where: {
			id: props.params.channelId,
		},
	});

	const member = await db.member.findFirst({
		where: {
			id: props.params.serverId,
			profileId: profile.id,
		},
	});

    // if (!channel || !member) return redirect("/");

	return (
        <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
            <ChatHeader 
                name={channel?.name}
                serverId={props.params.serverId}
                type="channel"
            />
        </div>
    )
};

export default ChannelIdPage;