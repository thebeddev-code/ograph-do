import { ClockHandleStateSetters } from "./ClockHandle";
import { Sunrise, Sun, Sunset, Moon } from "lucide-react";
import { ResetIcon } from "@radix-ui/react-icons";
import { cn } from "@/utils/cn";

interface Props {
  onQuickTimeSwitchClick: (args: {
    index?: number;
    event: React.MouseEvent<HTMLButtonElement>;
    resetClockHandle?: boolean;
  }) => void;
}
export function ClockHandleTools({ onQuickTimeSwitchClick }: Props) {
  return (
    <div className="absolute">
      <div
        className="z-20 relative flex items-center justify-center w-28 h-28 mx-auto rounded-full"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className={cn(
            `absolute 
                    w-8 h-8 flex items-center justify-center text-gray-500 hover:text-slate-500
                    bg-white/40 rounded-full border transition-colors duration-300`,
          )}
          onClick={(e) =>
            onQuickTimeSwitchClick({
              resetClockHandle: true,
              event: e,
            })
          }
          title="Reset clock"
        >
          <ResetIcon className="w-5 h-5" />
        </button>
        <button
          className="absolute translate-x-7 -translate-y-7 opacity-40 hover:opacity-100
                    w-8 h-8 flex items-center justify-center text-gray-500 hover:text-slate-500
                    bg-white/40 rounded-full border transition-colors duration-300"
          onClick={(e) =>
            onQuickTimeSwitchClick({
              index: 1,
              event: e,
            })
          }
          title="Morning"
        >
          <Sunrise className="w-5 h-5" />
        </button>

        <button
          className="absolute translate-7 opacity-40 hover:opacity-100
                    w-8 h-8 flex items-center justify-center text-gray-500 hover:text-yellow-500
                    bg-white/40 rounded-full border transition-colors duration-300"
          onClick={(e) =>
            onQuickTimeSwitchClick({
              index: 2,
              event: e,
            })
          }
          title="Day"
        >
          <Sun className="w-5 h-5" />
        </button>

        <button
          className="absolute -translate-x-7 translate-y-7 opacity-40 hover:opacity-100
                    w-8 h-8 flex items-center justify-center text-gray-500 hover:text-purple-500
                    bg-white/40 rounded-full border transition-colors duration-300"
          onClick={(e) =>
            onQuickTimeSwitchClick({
              index: 3,
              event: e,
            })
          }
          title="Evening"
        >
          <Sunset className="w-5 h-5" />
        </button>

        <button
          className="absolute -translate-7 opacity-40 hover:opacity-100
                    w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-800
                    bg-white/40 rounded-full border transition-colors duration-300"
          onClick={(e) =>
            onQuickTimeSwitchClick({
              index: 4,
              event: e,
            })
          }
          title="Night"
        >
          <Moon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
