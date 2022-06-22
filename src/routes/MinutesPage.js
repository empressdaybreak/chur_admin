import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, updateDoc } from "firebase/firestore";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { dbService } from "../fbase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFeatherPointed, faXmark } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";

const ArticleBox = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    font-size: 20px;
`;

const ArticleCard = styled.div`
    border: none;
    box-shadow: 0 2px 10px rgb(0 0 0 / 10%);
    border-radius: 5px;

    background-color: #fff;
    color: #000;

    padding: 20px;
    margin: 20px;
    box-sizing: border-box;
    
    display: flex;
    flex-direction: column;
    justify-content: space-between;    

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
    color: #000;

    position: fixed;
    left: 0;
    top: 0;
    z-index: 9999;

    & > div {
        width: 700px;
        height: 700px;
        background: #fff;

        font-size: 20px;
        
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
    }
`;

const ContentForm = styled.div`
    height: calc(700px - 160px);

    border: none;
    box-shadow: 0 2px 10px rgb(0 0 0 / 10%);
    border-radius: 5px;
    padding: 10px;

    white-space: pre-wrap;
    overflow-y: scroll;
`;

const InputForm = styled.form`
    display: flex;
    flex-direction: column;

    & textarea {
        resize: none;

        height: calc(700px - 160px);

        border: none;
        box-shadow: 0 2px 10px rgb(0 0 0 / 10%);
        border-radius: 5px;
        padding: 10px;

        margin-bottom: 20px;

        overflow-y: scroll;
    }

    & button {
        border-radius: 5px;
        color: #fff;
        padding: 5px 10px;
        border: none;
        background-color: #14aaf5;
        cursor: pointer;
    }
`;

const MinutesContainer = styled.div`
    display: flex;
    flex-direction: column;

    & > div {
        margin-bottom: 20px;
    }

    & button {
        border-radius: 5px;
        color: #fff;
        padding: 5px 10px;
        border: none;
        background-color: #14aaf5;
        cursor: pointer;
    }
`;

const AlertDesc = styled.p`
    text-align: center;
    font-size: 18px;

    padding: 30px 0;
`;

const MinutesPage = ({ userObj }) => {
    const date = moment().format("YYYY-MM-DD");
    const [textVal, setTextVal] = useState("");
    const [newTextVal, setNewTextVal] = useState("");
    const [data, setData] = useState([]);

    const [modalData, setModalData] = useState("");
    const [modalDay, setModalDay] = useState("");
    const [modalId, setModalId] = useState("");
    const [modalToggl, setModalToggle] = useState(false);

    const [minutesModifyToggle, setMinutesModifyToggle] = useState(false);

    const handleSetValue = (event) => {
        const { target: { name, value } } = event;

        if (name === "textBox") {
            setTextVal(value);
        } else if (name === "newTextBox") {
            setNewTextVal(value);
        }
    };

    const onSubmit = async (event) => {
        const { target: { name } } = event;

        event.preventDefault();

        if (name === "minutes") {
            setModalToggle(false);

            const itemObj = {
                index: data.length,
                content: textVal,
                writer: userObj.displayName,
                addDay: date,
            }

            await addDoc(collection(dbService, "minutes"), itemObj);
            setTextVal("");
        } else if (name === "newMinutes") {
            setMinutesModifyToggle(false);
            setModalToggle(false);

            await updateDoc(doc(dbService, "minutes", modalId), {
                content: newTextVal,
            });
        }
    };

    const onDeleteItem = async (id) => {
        const ok = window.confirm("삭제하시겠습니까?");

        if (ok) {
            await deleteDoc(doc(dbService, "minutes", id));
        }
    };
    
    const modalNumberSend = (content, addDay, id) => {        
        setModalData(content);
        setModalDay(addDay);
        setModalToggle(true);
        setModalId(id);
    };

    const modalClose = () => {
        setModalToggle(false);
        setMinutesModifyToggle(false);
        setModalData("");
        setModalDay("");
        setModalId("");
        setTextVal("");
    }

    useEffect(() => {
        const q = query(collection(dbService, "minutes"), orderBy("addDay", "desc"));

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
            <button
                onClick={() => setModalToggle(true)}
                style={{
                    borderRadius: "5px",
                    color: "#fff",
                    padding: "5px 10px",
                    border: "none",
                    margin: "20px",
                    backgroundColor: "#14aaf5",
                    cursor: "pointer"
                }}
            >
                <FontAwesomeIcon icon={faFeatherPointed} />
                새로쓰기
            </button>

            <ArticleBox>
                {data.map((data, index) => (
                    <ArticleCard key={index}>
                        <div>
                            <div onClick={ () => modalNumberSend(data.content, data.addDay, data.id) } style={{cursor: "pointer"}}>
                                <span style={{ marginRight: "10px" }}>{data.writer.replace(process.env.REACT_APP_USERAUTH_TAG, '')}</span>
                                <p>{data.addDay} 회의록</p>    
                            </div>

                            <FontAwesomeIcon icon={faXmark} onClick={() => onDeleteItem(data.id) } style={{cursor: "pointer"}} />
                        </div>
                    </ArticleCard>
                ))}
            </ArticleBox>

            {data.length === 0 &&
                <AlertDesc>기록이 없습니다.</AlertDesc>
            }

            {modalToggl &&
                <ModalAlert>
                    <div>
                        {modalData === "" ? (
                            <>
                                <div>
                                    <p>{date} 회의록</p>
                                    <FontAwesomeIcon icon={faXmark} onClick={() => modalClose()} style={{cursor: "pointer"}} />
                                </div>

                                <InputForm onSubmit={onSubmit} name="minutes">
                                    <textarea
                                        placeholder="회의 내용을 적어주세요."
                                        value={textVal}
                                        onChange={handleSetValue}
                                        name="textBox"
                                    />
                                    <button>등록</button>
                                </InputForm>
                            </>
                        ) : (
                            <>
                                <div>
                                    <p>{modalDay} 회의록</p>
                                    <FontAwesomeIcon icon={faXmark} onClick={() => modalClose()} style={{cursor: "pointer"}} />
                                </div>

                                <MinutesContainer>
                                    {!minutesModifyToggle ? (
                                        <>
                                            <ContentForm>
                                                {modalData}
                                            </ContentForm>
                                
                                                <button onClick={() => {
                                                    setMinutesModifyToggle(true);
                                                    setNewTextVal(modalData);
                                                }}>수정</button>
                                        </>
                                    ) : (
                                        <>
                                            <InputForm onSubmit={onSubmit} name="newMinutes">
                                                <textarea
                                                    placeholder={modalData}
                                                    value={newTextVal}
                                                    onChange={handleSetValue}
                                                    name="newTextBox"
                                                />
                                                <button>수정완료</button>
                                            </InputForm>
                                        </>
                                    )}
                                </MinutesContainer>
                            </>
                        )}
                    </div>
                </ModalAlert>
            }
        </>
    );
};

export default MinutesPage;