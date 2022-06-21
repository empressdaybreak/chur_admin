import React from "react";
import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import styled from "styled-components";
import UserAddForm from "../components/UserAddForm";
import UserList from "../components/UserList";
import { dbService } from "../fbase";
import UserCounter from "../components/UserCounter";

const FlexBox = styled.div`
    display: flex;
    flex-direction: column;

    & > div {
        margin: 20px;
    }
`;

const UserHeader = styled.div`
    /* display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between; */
    display: grid;
    grid-template-columns: repeat(11, 1fr);

    border: none;
    box-shadow: 0 2px 10px rgb(0 0 0 / 10%);
    border-radius: 5px;
    background-color: #fff;
    color: #000;

    padding: 1rem;

    text-align: center;

    & p {
        margin: 0;
        flex: 1;
    }

    & {
        margin-bottom: 0 !important;
    }
`;

const UserListPage = ({ status }) => {
    const [data, setData] = useState([]);
   
    useEffect(() => {
        const q = query(collection(dbService, "users"), where("status", "==", status ? "정상" : "탈퇴"), orderBy("rank"));
        
        onSnapshot(q, (querySnapshot) => {
            const userArray = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));

            setData(userArray);
        });
    }, []);

    return (
        <FlexBox>
            {status &&
                <UserCounter userData={data} />
            }

            <UserHeader>
                <p>번호</p>
                <p>이름</p>
                <p>가입일자</p>
                <p>가입일</p>
                <p>가입경로</p>
                <p>지인</p>
                <p>비고</p>
                <p>계급</p>
                <p>상태</p>
                <p>탈퇴사유</p>
                <p>버튼</p>
            </UserHeader>

            <div>
                {data.map((user, index) => (
                    <UserList
                        statusProp={status ? "정상" : "탈퇴"}
                        userObj={user}
                        key={user.id}
                        index={index+1}
                    />
                ))}
            </div>

            {status &&
                <UserAddForm />
            }
            
        </FlexBox>
    );
};

export default UserListPage;