import { arrayUnion, deleteDoc, doc, FieldValue, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { dbService } from "../fbase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";

const Card = styled.div`
    border: none;
    box-shadow: 0 2px 10px rgb(0 0 0 / 10%);
    border-radius: 5px;
    
    padding: 15px;

    color: #000;
    font-size: 20px;
    line-height: 1.3;

    position: relative;

    background-color: #fff;

    position: relative;

    &:not(:last-child) {
        margin-bottom: 15px;
    }

    & > p {
        margin: 10px 0;
        white-space: pre-wrap;
        
        position: relative;
    }

    & img {
        position: absolute;
        right: 0;
        top: 0;
        z-index: 1;

        width: 100px;
        opacity: 0.5;
    }
`;

const ActiveStatus = styled.span`
    height: 10px;
    width: 50%;

    border-radius: 10px;

    margin-right: 5px;
    
    display: inline-block;
`;

const FlexBox = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;

    & > p:last-child {
        padding: 5px;
        color: #fff;
        border-radius: 5px;
        background-color: #14aaf5;

        z-index: 9999;
    }
`;

const VoteBox = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 10px 0;

    & > p {
        padding: 5px;
        margin-right: 5px;
        color: #fff;
        border-radius: 5px;

        z-index: 9999;
    }
`;

const SubMenuContainer = styled.div`
    position: absolute;
    right: 0;
    top: 50px;
    z-index: 9999;

    background-color: #fff;
    border: 1px solid #dadada;
    border-radius: 5px;

    & p {
        padding: 10px 50px;
        cursor: pointer;

        &:hover {
            background-color: #dadada;
        }
    }
`;

const ButtonArea = styled.div`
    & button {
        border-radius: 5px;
        color: #fff;
        padding: 5px 10px;
        border: none;
        margin-top: 10px;

        &:first-child {
            background-color: skyblue;    
            margin-right: 10px;
        }

        &:last-child {
            background-color: red;
        }
    }
`;

const TextArea = styled.textarea`
    border: 1px solid #dadada;
    border-radius: 5px;
    resize: none;

    width: 100%;

    padding: 10px;
    box-sizing: border-box;

    &:focus {
        outline: none;
    }
`;

const Todo = ({ itemObj, userObj }) => {    
    const [editing, setEditing] = useState(false);
    const [newTodo, setNewTodo] = useState(itemObj.itemDesc);
    const [menuFlag, setMenuFlag] = useState(false);

    const [isVote, setIsVote] = useState(false);

    const onChange = (event) => {
        const { target: { name, value } } = event;

        if (name === "newTodo") {
            setNewTodo(value);
        }
    };

    const deleteItem = async (id) => {
        const ok = window.confirm("삭제하시겠습니까?");
        setMenuFlag(false);
        if (ok) {
            await deleteDoc(doc(dbService, "item_board", id));
        }
    };

    const updateItemStatus = async (id, status) => {
        setMenuFlag(false);

        if (status === "agree") {
            if (Object.keys(itemObj.vote).length !== 0) {
                // await updateDoc(doc(dbService, "item_board", id), {
                //     vote: [
                //         ...itemObj.vote, { name: userObj.displayName.replace(process.env.REACT_APP_USERAUTH_TAG, ''), vote: "agree", color: "#25e8c8" },
                //     ],
                // })

                // if (Object.keys(itemObj.vote).length >= 1 && itemObj.vote.some(item => item.vote === "agree")) {
                //     await updateDoc(doc(dbService, "item_board", id), {
                //         itemStatus: "agree",
                //     }); 
                // }
                
                console.log(itemObj.vote.some(item => item.vote === "agree"));
            } else if (Object.keys(itemObj.vote).length == 0) {
                await updateDoc(doc(dbService, "item_board", id), {
                    vote: [
                        { name: userObj.displayName.replace(process.env.REACT_APP_USERAUTH_TAG, ''), vote: "agree", color: "#25e8c8" },
                    ],
                });
            };
        } else if (status === "disagree") {
            if (Object.keys(itemObj.vote).length != 0) {
                await updateDoc(doc(dbService, "item_board", id), {
                    vote: [
                        ...itemObj.vote, { name: userObj.displayName.replace(process.env.REACT_APP_USERAUTH_TAG, ''), vote: "disagree", color: "#ff5263"  },
                    ],
                })

                if (Object.keys(itemObj.vote).length >= 1) {
                    await updateDoc(doc(dbService, "item_board", id), {
                        itemStatus: "disagree",
                    }); 
                }
            } else if (Object.keys(itemObj.vote).length == 0) {
                await updateDoc(doc(dbService, "item_board", id), {
                    vote: [
                        { name: userObj.displayName.replace(process.env.REACT_APP_USERAUTH_TAG, ''), vote: "disagree", color: "#ff5263" },
                    ],
                });
            };         
        } else if (status === "hold") {
            await updateDoc(doc(dbService, "item_board", id), {
                itemStatus: "hold",
            });
        }
    };

    const ActiveStatusColor = () => {
        let color = "";
        if (itemObj.itemStatus === "new") {
            color = "#dadada";
            return color;
        } else if (itemObj.itemStatus === "agree") {
            color = "#25e8c8";
            return color;
        } else if (itemObj.itemStatus === "disagree") {
            color = "#ff5263";
            return color;
        } else if (itemObj.itemStatus === "hold") {
            color = "#796eff";
            return color;
        }
    };

    const updateItem = async (id) => {
        setEditing(false);

        if (newTodo === "") {
            await updateDoc(doc(dbService, "item_board", id), {
                itemDesc: itemObj.itemDesc,
            });

            setNewTodo(itemObj.itemDesc);
        } else {
            await updateDoc(doc(dbService, "item_board", id), {
                itemDesc: newTodo,
            });
        }
    };

    const toggleMenu = () => {
        setMenuFlag((prev) => !prev);

        if (Object.keys(itemObj.vote).length != 0) {
            const result = itemObj.vote.some(item => item.name === userObj.displayName.replace(process.env.REACT_APP_USERAUTH_TAG, ''));
            if (result) {
                setIsVote(true);
            } else {
                setIsVote(false);
            }
        }
    };
    
    return (
        <>
            <Card>
                <FlexBox>
                    <ActiveStatus
                        style={{ backgroundColor: ActiveStatusColor() }}
                    />
                    {!editing && (
                        <div onClick={toggleMenu} style={{ padding: "0 10px", zIndex: "999" }}>
                            <FontAwesomeIcon icon={faEllipsisV} />
                        </div>
                    )}
                </FlexBox>
                {editing ? (
                    <TextArea name="newTodo" value={newTodo} onChange={onChange} placeholder={itemObj.itemDesc} />
                    ) : (
                        <p>{itemObj.itemDesc}</p>
                    )
                }
                
                <FlexBox>
                    <p>{itemObj.addDay}</p>
                    <p>{itemObj.writer.replace(process.env.REACT_APP_USERAUTH_TAG, '')}</p>
                </FlexBox>

                {itemObj.vote !== undefined &&
                    Object.keys(itemObj.vote).length != 0 &&
                    <VoteBox>
                        {itemObj.vote.map((data, index) => (
                            data.vote === "agree" ? (
                                <p key={index} style={{ backgroundColor: data.color }}>
                                    {data.name}
                                </p>
                            ) : (
                                <p key={index} style={{ backgroundColor: data.color }}>
                                    {data.name}
                                </p>
                            )
                        ))}
                    </VoteBox>
                }
                
                {editing && (
                    <ButtonArea>
                        <button onClick={() => updateItem(itemObj.id)}>수정</button>
                        <button onClick={() => { setEditing(false); setNewTodo(itemObj.itemDesc) }}>취소</button>
                    </ButtonArea>
                )}

                {menuFlag && 
                    <SubMenuContainer>
                        {itemObj.itemStatus === "new" &&
                            <>
                                <p onClick={() => { setEditing(true); setMenuFlag(false); }}>수정</p>
                        
                                {Object.keys(itemObj.vote).length != 0 ? (
                                    <>
                                        {!itemObj.vote.some(item => item.name == userObj.displayName.replace(process.env.REACT_APP_USERAUTH_TAG, '')) && 
                                            <>
                                                <p onClick={() => updateItemStatus(itemObj.id, "agree")}>가결</p>
                                                <p onClick={() => updateItemStatus(itemObj.id, "disagree")}>기각</p>
                                            </>
                                        }
                                    </>
                                    ) : (
                                    <>
                                        <p onClick={() => updateItemStatus(itemObj.id, "agree")}>가결</p>
                                        <p onClick={() => updateItemStatus(itemObj.id, "disagree")}>기각</p>
                                    </>
                                    )
                                }
                            </>
                        }

                        <p onClick={() => deleteItem(itemObj.id)}>삭제</p>
                        <p onClick={() => updateItemStatus(itemObj.id, "hold")}>보류</p>
                    </SubMenuContainer>
                }

                {itemObj.itemStatus === "agree" &&
                    <img src={`${process.env.PUBLIC_URL}/img/agree.png`} alt="가결 이미지" />
                }

                {itemObj.itemStatus === "disagree" &&
                    <img src={`${process.env.PUBLIC_URL}/img/disagree.png`} alt="기각 이미지" />
                }

                {itemObj.itemStatus === "hold" &&
                    <img src={`${process.env.PUBLIC_URL}/img/hold.png`} alt="보류 이미지" />
                }
            </Card>
        </>
    );
};

export default Todo;