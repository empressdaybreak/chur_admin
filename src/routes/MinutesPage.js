import { addDoc, collection, onSnapshot, query } from "firebase/firestore";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { dbService } from "../fbase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook } from "@fortawesome/free-solid-svg-icons";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";

const ArticleBox = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;

    margin: 0 20px;
`;

const ArticleCard = styled.div`
    border: none;
    box-shadow: 0 2px 10px rgb(0 0 0 / 10%);
    border-radius: 5px;

    padding: 20px;
    margin: 20px;
    box-sizing: border-box;
    
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    white-space: pre-wrap;

    &:not(:last-child) {
        margin-right: 1 0px;
    }

    & > p {
        margin: 20px 0;
    }

    & div {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;

        & span {
            padding: 5px;
            color: #fff;
            border-radius: 5px;
            background-color: #14aaf5;
        }

        & p {
            margin: 0;
        }
    }
`;

const MinutesPage = ({ userObj }) => {
    const date = moment().format("YYYY-MM-DD");
    const [textVal, setTextVal] = useState("");
    const [data, setData] = useState([]);

    const handleSetValue = (event) => {
        setTextVal(event.target.value);
    };

    const onSubmit = async (event) => {
        event.preventDefault();

        const itemObj = {
            content: textVal,
            writer: userObj.displayName,
            addDay: date,
        }

        await addDoc(collection(dbService, "minutes"), itemObj);
        setTextVal("");
    };
    
    useEffect(() => {
        const q = query(collection(dbService, "minutes"));

        onSnapshot(q, (querySnapshot) => {
            const itemArray = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));

            setData(itemArray);
        });
    }, []);

    return (
        <>
            <form onSubmit={onSubmit}>
                <textarea
                    placeholder="여기에&#13;&#10;입력하세요"
                    value={textVal}
                    onChange={handleSetValue}
                    name="textbox"
                />

                <button>등록</button>
            </form>


            <ArticleBox>
                {data.map((data, index) => (
                    <ArticleCard key={index}>
                        <div>
                            <p>{data.addDay} 회의록</p>
                            <FontAwesomeIcon icon={faBook} />
                        </div>

                        <p>{data.content}</p>

                        <div>
                            <FontAwesomeIcon icon={faPen} />
                            <span>{data.writer}</span>
                        </div>
                    </ArticleCard>
                ))}
            </ArticleBox>
        </>
    );
};

export default MinutesPage;