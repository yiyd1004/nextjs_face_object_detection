"use client";

import { Volume2 } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import { Button } from "./ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Slider } from "./ui/slider";

type Props = {
    volume: number;
    setVolume: Dispatch<SetStateAction<number>>;
    beep: (num: number) => void | undefined;
};

const Volume = (props: Props) => {
    const [isSliderOpen, setSliderOpen] = useState<boolean>(false);
    return (
        <HoverCard openDelay={0} closeDelay={0}>
            <HoverCardTrigger>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant={"outline"}
                            size={"icon"}
                            onClick={() => {
                                setSliderOpen((prev) => !prev);
                            }}
                        >
                            <Volume2 />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent>
                        <Slider
                            min={0}
                            max={1}
                            step={0.2}
                            defaultValue={[props.volume]}
                            onValueCommit={(val) => {
                                props.setVolume(val[0]);
                                props.beep(val[0]);
                            }}
                        />
                    </PopoverContent>
                </Popover>
            </HoverCardTrigger>
            <HoverCardContent
                className="w-80"
                hidden={isSliderOpen ? true : false}
            >
                <div className="flex flex-col justify-between space-x-4">
                    <strong>Volume Slider 🔊</strong>
                    <p>Adjust the volume level of the notifications.</p>
                </div>
            </HoverCardContent>
        </HoverCard>
    );
};

export default Volume;
