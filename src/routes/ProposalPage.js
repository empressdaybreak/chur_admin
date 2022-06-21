import React, { useEffect, useState } from "react";
import { addDoc, collection, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { dbService } from "../fbase";
import styled from "styled-components";
import Todo from "../components/Todo";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCat, faXmark } from "@fortawesome/free-solid-svg-icons";
import { faShieldCat } from "@fortawesome/free-solid-svg-icons";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";

const TodoContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
`;

const TodoList = styled.div`
    width: 25%;

    padding: 25px;

    &:not(:last-child) {
        margin-right: 10px;
    }

    & > p {
        margin: 0 0 10px;
    }
`;

const TodoListHeader = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    
    font-size: 18px;
    font-weight: bold;

    margin-bottom: 20px;

    & p {
        margin: 0;
    }
`;

const Card = styled.div`
    border: none;
    box-shadow: 0 2px 10px rgb(0 0 0 / 10%);
    border-radius: 5px;
    
    background: #fff;
    color: #000;

    padding: 15px;

    &:not(:last-child) {
        margin-bottom: 15px;
    }
`;

const Input = styled.input`
    border: 1px solid #dadada;
    border-radius: 5px;

    padding: 10px;

    &:focus {
        outline: none;
    }
`;

const FlexBox = styled.div`
    display: flex;
    flex-direction: column;
`;

const ButtonArea = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
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

const AlertDesc = styled.p`
    text-align: center;
    font-size: 18px;

    padding: 30px 0;
`;

const ProposalPage = ({ userObj }) => {
    const date = moment().format("YYYY-MM-DD");
    const [newData, setNewData] = useState([]);
    const [agreeData, setAgreeData] = useState([]);
    const [disagreeData, setDisagreeData] = useState([]);
    const [holdData, setHoldData] = useState([]);

    const [inputTodo, setInputTodo] = useState("");
    const [addTodoFlag, setAddTodoFlag] = useState(false);

    const onSubmit = async (event) => {
        event.preventDefault();
        setAddTodoFlag(false);

        const itemObj = {
            itemStatus: "new",
            itemDesc: inputTodo,
            writer: userObj.displayName,
            addDay: date,
        };        

        await addDoc(collection(dbService, "item_board"), itemObj);
        setInputTodo("");
    }

    const onChange = (event) => {
        const { target: { name, value } } = event;

        if (name === "todo") {
            setInputTodo(value);
        }
    }

    useEffect(() => {
        const newQuery = query(collection(dbService, "item_board"), where("itemStatus", "==", "new"), orderBy("addDay", "desc"));
        const agreeQuery = query(collection(dbService, "item_board"), where("itemStatus", "==", "agree"), orderBy("addDay"));
        const disagreeQuery = query(collection(dbService, "item_board"), where("itemStatus", "==", "disagree"), orderBy("addDay"));
        const holdQuery = query(collection(dbService, "item_board"), where("itemStatus", "==", "hold"), orderBy("addDay"));

        onSnapshot(newQuery, (querySnapshot) => {
            const itemArray = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));

            setNewData(itemArray);
        });

        onSnapshot(agreeQuery, (querySnapshot) => {
            const itemArray = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));

            setAgreeData(itemArray);
        });

        onSnapshot(disagreeQuery, (querySnapshot) => {
            const itemArray = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));

            setDisagreeData(itemArray);
        });

        onSnapshot(holdQuery, (querySnapshot) => {
            const itemArray = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));

            setHoldData(itemArray);
        });
    }, []);

    return (
        <TodoContainer>
            <TodoList>
                <TodoListHeader>
                    <p>건의사항</p>
                    <p onClick={() => setAddTodoFlag(true)}>
                        <FontAwesomeIcon icon={faCat} />
                    </p>
                </TodoListHeader>

                {addTodoFlag &&
                    <Card>
                        <form onSubmit={onSubmit}>
                            <FlexBox>
                                <Input
                                    type="text"
                                    name="todo"
                                    onChange={onChange}
                                    value={inputTodo}
                                    placeholder="건의사항을 적어주세요."
                                />

                                <ButtonArea>
                                    <button><FontAwesomeIcon icon={faPaperPlane} /></button>
                                    <button onClick={() => setAddTodoFlag(false)}><FontAwesomeIcon icon={faXmark} /></button>
                                </ButtonArea>
                            </FlexBox>
                        </form>
                    </Card>
                }

                {newData.map((item, index) => (
                    <Todo
                        itemObj={item}
                        key={index}
                    />
                ))}

                {newData.length === 0 && 
                    <AlertDesc>의견이 없습니다.</AlertDesc>
                }
            </TodoList>

            <TodoList>
                <TodoListHeader>
                    <p>건의사항 가결</p>
                    <FontAwesomeIcon icon={faShieldCat} />
                </TodoListHeader>

                {agreeData.map((item, index) => (
                    <Todo
                        itemObj={item}
                        key={index}
                    />
                ))}
            </TodoList>

            <TodoList>
                <TodoListHeader>
                    <p>건의사항 기각</p>
                    <FontAwesomeIcon icon={faShieldCat} />
                </TodoListHeader>
                {disagreeData.map((item, index) => (
                    <Todo
                        itemObj={item}
                        key={index}
                    />
                ))}
            </TodoList>

            <TodoList>
                <TodoListHeader>
                    <p>건의사항 보류</p>
                    <FontAwesomeIcon icon={faShieldCat} />
                </TodoListHeader>

                {holdData.map((item, index) => (
                    <Todo
                        itemObj={item}
                        key={index}
                    />
                ))}
            </TodoList>
        </TodoContainer>
    );
};

export default ProposalPage;