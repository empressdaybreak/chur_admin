import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import React, { useState } from "react";
import styled from "styled-components";
import { dbService } from "../fbase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";

const Card = styled.div`
    border: none;
    box-shadow: 0 2px 10px rgb(0 0 0 / 10%);
    border-radius: 5px;
    
    padding: 15px;

    background-color: #fff;
    color: #000;

    position: relative;

    &:not(:last-child) {
        margin-bottom: 15px;
    }

    & > p {
        margin: 20px 0;
    }
`;

const Input = styled.input`
    border: 1px solid #dadada;
    border-radius: 5px;

    padding: 10px;
    margin-right: 10px;

    &:focus {
        outline: none;
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

const Todo = ({ itemObj }) => {    
    const [editing, setEditing] = useState(false);
    const [newTodo, setNewTodo] = useState(itemObj.itemDesc);
    const [menuFlag, setMenuFlag] = useState(false);

    const onChange = (event) => {
        const { target: { name, value } } = event;

        if (name === "newTodo") {
            setNewTodo(value);
        }
    }

    const deleteItem = async (id) => {
        const ok = window.confirm("삭제하시겠습니까?");
        setMenuFlag(false);
        if (ok) {
            await deleteDoc(doc(dbService, "item_board", id));
        }
    }

    const updateItemStatus = async (id, status) => {
        setMenuFlag(false);

        if (status === "agree") {
            await updateDoc(doc(dbService, "item_board", id), {
                itemStatus: "agree",
            });
        } else if (status === "disagree") {
            await updateDoc(doc(dbService, "item_board", id), {
                itemStatus: "disagree",
            });
        } else if (status === "hold") {
            await updateDoc(doc(dbService, "item_board", id), {
                itemStatus: "hold",
            });
        }
    }

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
    }

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
    }

    const toggleMenu = () => {
        setMenuFlag((prev) => !prev);
    }

    return (
        <>
            <Card>
                <FlexBox>
                    <ActiveStatus
                        style={{ backgroundColor: ActiveStatusColor() }}
                    />
                    {!editing && (
                        <div onClick={toggleMenu} style={{ padding: "10px" }}>
                            <FontAwesomeIcon icon={faEllipsisV} />
                        </div>
                    )}
                </FlexBox>
                {editing ? (
                    <Input type="text" name="newTodo" value={newTodo} onChange={onChange} placeholder={itemObj.itemDesc} />
                    ) : (
                        <p>{itemObj.itemDesc}</p>
                    )
                }
                
                <FlexBox>
                    <p>{itemObj.addDay}</p>
                    <p>{itemObj.writer.replace('@breadcat', '')}</p>
                </FlexBox>
                
                {editing && (
                    <ButtonArea>
                        <button onClick={() => updateItem(itemObj.id)}>수정</button>
                        <button onClick={() => { setEditing(false); setNewTodo(itemObj.itemDesc) }}>취소</button>
                    </ButtonArea>
                )}

                {menuFlag && 
                    <SubMenuContainer>
                        {itemObj.itemStatus === "new" &&
                            <p onClick={() => { setEditing(true); setMenuFlag(false); }}>수정</p>
                        }
                        <p onClick={() => updateItemStatus(itemObj.id, "agree")}>가결</p>
                        <p onClick={() => updateItemStatus(itemObj.id, "disagree")}>기각</p>
                        <p onClick={() => updateItemStatus(itemObj.id, "hold")}>보류</p>
                        <p onClick={() => deleteItem(itemObj.id)}>삭제</p>
                    </SubMenuContainer>
                }
            </Card>
        </>
    );
};

export default Todo;