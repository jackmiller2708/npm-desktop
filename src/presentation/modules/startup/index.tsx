import { Button } from "@presentation/components/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@presentation/components/ui/empty";
import { ArrowUpRightIcon } from "lucide-react";

export function Startup() {
	return (
		<Empty>
			<EmptyHeader>
				<EmptyMedia variant="icon">
					<ArrowUpRightIcon />
				</EmptyMedia>
				<EmptyTitle>No Projects Yet</EmptyTitle>
				<EmptyDescription>
					You haven&apos;t created any projects yet. Get started by creating
					your first project.
				</EmptyDescription>
			</EmptyHeader>
			<EmptyContent>
				<div className="flex gap-2">
					<Button>Create Project</Button>
					<Button variant="outline">Open Project</Button>
				</div>
			</EmptyContent>
			<Button variant="link" asChild className="text-muted-foreground" size="sm">
				<a href="#">
					Learn More <ArrowUpRightIcon />
				</a>
			</Button>
		</Empty>
	);
}
