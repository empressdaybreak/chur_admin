import React, { useEffect, useState } from "react";
import { addDoc, collection, onSnapshot, query, where } from "firebase/firestore";
import { dbService } from "../fbase";
import styled from "styled-components";
import Todo from "../components/Todo";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCat } from "@fortawesome/free-solid-svg-icons";
import { faShieldCat } from "@fortawesome/free-solid-svg-icons";

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
    
    padding: 15px;

    &:not(:last-child) {
        margin-bottom: 15px;
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

const FlexBox = styled.div`
    display: flex;
    flex-direction: column;
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

const DashBoard = ({ userObj }) => {
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
        const newQuery = query(collection(dbService, "item_board"), where("itemStatus", "==", "new"));
        const agreeQuery = query(collection(dbService, "item_board"), where("itemStatus", "==", "agree"));
        const disagreeQuery = query(collection(dbService, "item_board"), where("itemStatus", "==", "disagree"));
        const holdQuery = query(collection(dbService, "item_board"), where("itemStatus", "==", "hold"));

        onSnapshot(newQuery, (querySnapshot) => {
            const userArray = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));

            setNewData(userArray);
        });

        onSnapshot(agreeQuery, (querySnapshot) => {
            const userArray = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));

            setAgreeData(userArray);
        });

        onSnapshot(disagreeQuery, (querySnapshot) => {
            const userArray = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));

            setDisagreeData(userArray);
        });

        onSnapshot(holdQuery, (querySnapshot) => {
            const userArray = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));

            setHoldData(userArray);
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
                                    <button>추가</button>
                                    <button onClick={() => setAddTodoFlag(false)}>취소</button>
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

export default DashBoard;