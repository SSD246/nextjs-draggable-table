import { useState, useEffect, useMemo } from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext, useSortable, arrayMove } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const columnNames = [
    "Имя", "Фамилия", "Возраст", "Город", "Страна", "Компания", "Должность", "Телефон", "Email", "Дата регистрации"
];

const generateData = () => {
    return Array.from({ length: 100 }, (_, index) => ({
        id: index + 1,
        Имя: `Имя${index + 1}`,
        Фамилия: `Фамилия${index + 1}`,
        Возраст: 20 + (index % 50),
        Город: "Город " + (index % 10),
        Страна: "Страна " + (index % 5),
        Компания: "Компания " + (index % 3),
        Должность: "Должность " + (index % 7),
        Телефон: "+7 900 000 0000",
        Email: `user${index + 1}@mail.com`,
        "Дата регистрации": "2024-01-01"
    }));
};

export default function Table() {
    const [columns, setColumns] = useState(columnNames);
    const [page, setPage] = useState(1);
    const [data, setData] = useState([]);

    useEffect(() => {
        if (typeof window !== "undefined") {
            setData(generateData());
        }
    }, []);

    const itemsPerPage = 10;

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = columns.indexOf(active.id);
        const newIndex = columns.indexOf(over.id);
        setColumns(arrayMove(columns, oldIndex, newIndex));
    };

    const paginatedData = useMemo(() => {
        const start = (page - 1) * itemsPerPage;
        return data.slice(start, start + itemsPerPage);
    }, [page, data]);

    if (!data.length) return <p>загрузка...</p>;

    return (
        <div>
            <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <table border="1">
                    <thead>
                    <SortableContext items={columns}>
                        <tr>
                            {columns.map((col, index) => (
                                <SortableHeader key={col} column={col} index={index} setColumns={setColumns} />
                            ))}
                        </tr>
                    </SortableContext>
                    </thead>
                    <tbody>
                    {paginatedData.map((row) => (
                        <tr key={row.id}>
                            {columns.map((col) => (
                                <td key={col}>{row[col]}</td>
                            ))}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </DndContext>
            <div>
                {Array.from({ length: 10 }, (_, i) => (
                    <button key={i} onClick={() => setPage(i + 1)} disabled={page === i + 1}>
                        {i + 1}
                    </button>
                ))}
            </div>
        </div>
    );
}

const SortableHeader = ({ column, index, setColumns }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: column });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        cursor: "grab",
    };

    return (
        <th ref={setNodeRef} style={style} {...attributes} {...listeners}>
            {column}
        </th>
    );
};
