import { arrayMove } from "@dnd-kit/sortable";

export const reorderColumns = (columns, oldIndex, newIndex) => {
    return arrayMove(columns, oldIndex, newIndex);
};
