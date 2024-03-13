"use client";

import { useState } from "react";
import InformationDetailDialog from "./InformationDetailDialog";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";

type Props = {};

const InformationDialog = (props: Props) => {
    const [isDialogOpen, setDialogOpen] = useState<boolean>(false);

    return (
        <HoverCard openDelay={0} closeDelay={0}>
            <HoverCardTrigger>
                <InformationDetailDialog setDialogOpen={setDialogOpen} />
            </HoverCardTrigger>
            <HoverCardContent className="w-80" hidden={isDialogOpen}>
                <div className="flex flex-col justify-between space-x-4">
                    <strong>Information ℹ️</strong>
                    <p>Information about his app.</p>
                </div>
            </HoverCardContent>
        </HoverCard>
    );
};

export default InformationDialog;
