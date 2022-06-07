import React, { useEffect, useState } from "react";
import moment from "moment";
import "moment/locale/ko";
import { addDoc, collection, onSnapshot } from "firebase/firestore";
import { dbService } from "../fbase";

const BoardTable = ({ columns, userObj }) => {
    const date = moment().format("YYYY-MM-DD");

    const [itemContent, setItemContent] = useState("");
    const [item, setItem] = useState("운영체제");
    const [data, setData] = useState([]);

    const itemSelect = ["운영체제", "운영방식"];

    const onChange = (event) => {
        const { target: { value, name } } = event;

        if (name === "itemContent") {
            setItemContent(value);
        } else if (name === "item") {
            setItem(value);
        }
    };

    const onSubmit = async (event) => {
        event.preventDefault();

        const boardObj = {
            itemContent: itemContent,
            item: item,
            writer: userObj.displayName,
            regist_day: date,
        };

        await addDoc(collection(dbService, "item_board"), boardObj);

        setItemContent("");
    };

    useEffect(() => {
        onSnapshot(collection(dbService, "item_board"), (snapshot) => {
            const itemArray = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));

            setData(itemArray);            
        })
    }, []);

    return (
        <>
            <table>
                <thead>
                    <tr>
                        {columns.map((column, index) => (
                            <th key={index}>
                                {column.Header}
                            </th>
                        ))}
                    </tr>
                </thead>

                <tbody>
                    {data.map((data, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{data.item}</td>
                            <td>{data.itemContent}</td>
                            <td>{data.writer}</td>
                            <td>{data.regist_day}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <form onSubmit={onSubmit}>
                <input type="text" name="itemContent" value={ itemContent } onChange={onChange} placeholder="안건 내용" />

                <select name="item" value={item} onChange={ onChange }>
                    {itemSelect.map((data, index) => (
                        <option key={index} value={ data }>
                            { data }
                        </option>
                    ))}
                </select>

                <input type="submit" value="등록" />
            </form>
        </>
    );
};

export default BoardTable;