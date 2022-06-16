import { addDoc, collection, onSnapshot, query } from "firebase/firestore";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { dbService } from "../fbase";
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

const ModalAlert = styled.div`
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);

    position: fixed;
    left: 0;
    top: 0;
    z-index: 9999;

    & > div {
        width: 700px;
        height: 700px;
        background: #fff;
        
        position: absolute;
        left: 50%;
        top: 50%;

        margin-left: -350px;
        margin-top: -350px;
        padding: 15px;

        box-sizing: border-box;
        border-radius: 5px;

        & p {
            margin: 0;
        }

        & > div:first-child {
            display: flex;
            flex-direction: row;
            justify-content: space-between;

            padding: 20px 5px;
        }

        & > div:last-child {
            height: 100%;

            border: none;
            box-shadow: 0 2px 10px rgb(0 0 0 / 10%);
            border-radius: 5px;
            padding: 10px;
        }
    }
`;

const MinutesPage = ({ userObj }) => {
    const date = moment().format("YYYY-MM-DD");
    const [textVal, setTextVal] = useState("");
    const [data, setData] = useState([]);

    const [modalData, setModalData] = useState("");
    const [modalDay, setModalDay] = useState("");
    const [modalToggl, setModalToggle] = useState(false);

    const handleSetValue = (event) => {
        setTextVal(event.target.value);
    };

    const onSubmit = async (event) => {
        event.preventDefault();

        const itemObj = {
            index: data.length,
            content: textVal,
            writer: userObj.displayName,
            addDay: date,
        }

        await addDoc(collection(dbService, "minutes"), itemObj);
        setTextVal("");
    };
    
    const modalNumberSend = (content, addDay) => {        
        setModalData(content);
        setModalDay(addDay);
        setModalToggle(true);
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
                    <ArticleCard key={index} onClick={ () => modalNumberSend(data.content, data.addDay) }>
                        <div>
                            <p>{data.addDay} 회의록</p>    
                            <span>{data.writer}</span>
                        </div>
                        {/* <p>{data.content}</p> */}                        
                    </ArticleCard>
                ))}
            </ArticleBox>

            {modalToggl &&
                <ModalAlert>
                    <div>
                        <div>
                            <p>{modalDay} 회의록</p>
                            <p onClick={() => setModalToggle(false)}>닫기</p>
                        </div>

                        <div>
                            <p>{modalData}</p>
                        </div>
                    </div>
                </ModalAlert>
            }
        </>
    );
};

export default MinutesPage;