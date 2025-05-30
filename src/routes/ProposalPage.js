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

const ProposalPage = ({ userObj }) => {
    const date = moment().format("YYYY-MM-DD");
    const [newData, setNewData] = useState([]);
    const [agreeData, setAgreeData] = useState([]);
    const [disagreeData, setDisagreeData] = useState([]);
    const [holdData, setHoldData] = useState([]);
    const [completeData, setCompleteData] = useState([]);

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
            vote: {},
        };

        await addDoc(collection(dbService, "item_board"), itemObj);

        await addDoc(collection(dbService, "logs"), {
            date: new Date(),
            name: "",
            type: "ProposalAdd",
            writer: userObj.displayName,
        });

        setInputTodo("");

        // discord webhook 전송 (새 건의 사항이 있을때만 트리거 됨)
        const request = new XMLHttpRequest();

        request.open("post", `${process.env.REACT_APP_WEBHOOK_URL}`);
        request.setRequestHeader('Content-type', 'application/json');

        const myEmbed = {
            title: "'" + userObj.displayName.replace(process.env.REACT_APP_USERAUTH_TAG, '') + "' 님이 새로운 건의사항을 등록하였다냥!",
            description: '건의사항 내용: "' + inputTodo + '" \n https://empressdaybreak.github.io/chur_admin/#/proposal',
            color: hexToDecimal("#58b9ff"),
        }

        const params = {
            username: "운영냥이봇",
            embeds: [myEmbed]
        }

        request.send(JSON.stringify(params));
    }

    const hexToDecimal = (hex) => {
        return parseInt(hex.replace("#", ""), 16)
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
        const completeQuery = query(collection(dbService, "item_board"), where("itemStatus", "==", "complete"), orderBy("addDay"));

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

        onSnapshot(completeQuery, (querySnapshot) => {
            const itemArray = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));

            setCompleteData(itemArray);
        });
    }, []);

    return (
        <TodoContainer>
            <TodoList>
                <TodoListHeader>
                    <p>건의사항 <ActiveStatus style={{ backgroundColor: "#dadada" }} /></p>
                    <p onClick={() => setAddTodoFlag(true)}>
                        <FontAwesomeIcon icon={faCat} />
                    </p>
                </TodoListHeader>

                {addTodoFlag &&
                    <Card>
                        <form onSubmit={onSubmit}>
                            <FlexBox>
                                <TextArea
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
                        userObj={userObj}
                    />
                ))}

                {newData.length === 0 &&
                    <AlertDesc>의견이 없습니다.</AlertDesc>
                }
            </TodoList>

            <TodoList>
                <TodoListHeader>
                    <p>건의사항 가결 <ActiveStatus style={{ backgroundColor: "#25e8c8" }} /></p>
                    <p><FontAwesomeIcon icon={faShieldCat} /></p>
                </TodoListHeader>

                {agreeData.map((item, index) => (
                    <Todo
                        itemObj={item}
                        key={index}
                        userObj={userObj}
                    />
                ))}

                {agreeData.length === 0 &&
                    <AlertDesc>의견이 없습니다.</AlertDesc>
                }
            </TodoList>

            <TodoList>
                <TodoListHeader>
                    <p>건의사항 기각 <ActiveStatus style={{ backgroundColor: "#ff5263" }} /></p>
                    <p><FontAwesomeIcon icon={faShieldCat} /></p>
                </TodoListHeader>
                {disagreeData.map((item, index) => (
                    <Todo
                        itemObj={item}
                        key={index}
                        userObj={userObj}
                    />
                ))}

                {disagreeData.length === 0 &&
                    <AlertDesc>의견이 없습니다.</AlertDesc>
                }
            </TodoList>

            <TodoList>
                <TodoListHeader>
                    <p>건의사항 보류 <ActiveStatus style={{ backgroundColor: "#796eff" }} /></p>
                    <p><FontAwesomeIcon icon={faShieldCat} /></p>
                </TodoListHeader>

                {holdData.map((item, index) => (
                    <Todo
                        itemObj={item}
                        key={index}
                        userObj={userObj}
                    />
                ))}

                {holdData.length === 0 &&
                    <AlertDesc>의견이 없습니다.</AlertDesc>
                }
            </TodoList>

            <TodoList>
                <TodoListHeader>
                    <p>건의사항 처리 완료 <ActiveStatus style={{ backgroundColor: "#4169E1" }} /></p>
                    <p><FontAwesomeIcon icon={faShieldCat} /></p>
                </TodoListHeader>

                {completeData.map((item, index) => (
                    <Todo
                        itemObj={item}
                        key={index}
                        userObj={userObj}
                    />
                ))}

                {completeData.length === 0 &&
                    <AlertDesc>의견이 없습니다.</AlertDesc>
                }
            </TodoList>
        </TodoContainer>
    );
};


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

    border-bottom: 3px solid #fff;
    padding-bottom: 10px;
    margin-bottom: 20px;

    & p {
        font-size: 25px;
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

const ActiveStatus = styled.span`
    height: 10px;
    width: 10px;

    border-radius: 10px;

    margin-right: 5px;
    
    display: inline-block;
`;

export default ProposalPage;
