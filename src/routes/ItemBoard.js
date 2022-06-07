import React from "react";
import BoardTable from "../components/BoardTable";

const ItemBoard = ({ userObj }) => {
    const columns = [
        { Header: "번호" },
        { Header: "타입" },
        { Header: "안건" },
        { Header: "작성자" },
        { Header: "등록일" },
    ];

    return (
        <>
            <BoardTable
                columns={ columns }
                userObj={ userObj }
            />
        </>
    );
};

export default ItemBoard;