import { Briefcase, User, Home, ShoppingCart, Grip, BrainCircuit, Feather, FileText, Clock, Timer, Hourglass, LucideProps, LucideIcon } from "lucide-react";
import { TaskCategory, TaskType, TaskDuration } from "@/lib/types";

type TaskIconProps = {
    category?: TaskCategory;
    type?: TaskType;
    duration?: TaskDuration;
} & LucideProps;

const categoryIcons: Record<TaskCategory, LucideIcon> = {
    Work: Briefcase,
    Personal: User,
    Household: Home,
    Errand: ShoppingCart,
    Other: Grip,
};

const typeIcons: Record<TaskType, LucideIcon> = {
    deep: BrainCircuit,
    light: Feather,
    admin: FileText,
};

const durationIcons: Record<TaskDuration, LucideIcon> = {
    '15-minute': Clock,
    '30-minute': Timer,
    '1-hour': Hourglass,
};

export function TaskIcon({ category, type, duration, ...props }: TaskIconProps) {
    if (category) {
        const Icon = categoryIcons[category];
        return <Icon {...props} />;
    }
    if (type) {
        const Icon = typeIcons[type];
        return <Icon {...props} />;
    }
    if (duration) {
        const Icon = durationIcons[duration];
        return <Icon {...props} />;
    }
    return null;
}
