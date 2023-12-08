"use client";

import axios from "axios";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-modal-store";
import { ChannelType } from "@prisma/client";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogFooter,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Form,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
	FormField,
} from "@/components/ui/form";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectValue,
	SelectTrigger,
} from "@/components/ui/select";

const formSchema = z.object({
	name: z
		.string()
		.min(1, {
			message: "Channel name is required",
		})
		.max(255)
		.refine((name) => name !== "general", {
			message: "Channel name cannot be 'general'",
		}),
	type: z.nativeEnum(ChannelType),
});

export const CreateChannelModal = () => {
	const { type, isOpen, onClose } = useModal();
	const router = useRouter();
	const isModalOpen = isOpen && type === "createChannel";

	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			type: ChannelType.TEXT,
		},
	});

	const isLoading = form.formState.isSubmitting;

	const onSubmitMethod = async (values: z.infer<typeof formSchema>) => {
		console.log(values);
		try {
			await axios.post("/api/servers", values);
			form.reset();
			router.refresh();
			onClose();
			window.location.reload();
		} catch (error) {
			console.log(error);
		}
	};

	const handleClose = () => {
		form.reset();
		onClose();
	};

	return (
		<>
			<Dialog open={isModalOpen} onOpenChange={handleClose}>
				<DialogContent className="bg-white text-black p-0 overflow-hidden">
					<DialogHeader className="pt-8 px-6">
						<DialogTitle className="text-2xl text-center font-bold">
							Create Channel
						</DialogTitle>
					</DialogHeader>
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmitMethod)}
							className="space-y-8"
						>
							<div className="space-y-8 px-6 ">
								<FormField
									control={form.control}
									name="name"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
												Channel name
											</FormLabel>
											<FormControl>
												<Input
													disabled={isLoading}
													className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
													placeholder="Enter a channel name"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="type"
									render={({ field }) => (
										<FormItem>
											<FormLabel>
												Channel Type
											</FormLabel>
											<Select
												disabled={isLoading}
												onValueChange={
													field.onChange
												}
												defaultValue={field.value}
											>
												<FormControl>
													<SelectTrigger className="bg-zinc-300/50 border-0 focus:ring-0 text-black ring-offset-0 focus:ring-offset-0 capitalize outline-none">
														<SelectValue placeholder="Select a channel type" />
													</SelectTrigger>
												</FormControl>

												<SelectContent>
													{
														Object.values(ChannelType).map((type) => (
															<SelectItem
																key={type}
																value={type}
																className="capitalize"
															>
																{type.toLowerCase()}
															</SelectItem>
														))
													}
												</SelectContent>
											</Select>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
							<DialogFooter className="bg-gray-100 px-6 py-4">
								<Button
									disabled={isLoading}
									variant="primary"
								>
									Create
								</Button>
							</DialogFooter>
						</form>
					</Form>
				</DialogContent>
			</Dialog>
		</>
	);
};