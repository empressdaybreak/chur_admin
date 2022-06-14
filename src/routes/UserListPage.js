import React from "react";
import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import styled from "styled-components";
import UserAddForm from "../components/UserAddForm";
import UserList from "../components/UserList";
import { dbService } from "../fbase";

const FlexBox = styled.div`
    display: flex;
    flex-direction: column;

    & > div {
        margin: 20px;
    }
`;

const UserListPage = () => {
    const [data, setData] = useState([]);
    const [withdrawaData, setWithdrawalData] = useState([]);

    // const columns = [
    //     { Header: "번호" },
    //     { Header: "이름" },
    //     { Header: "가입일" },
    //     { Header: "가입기간" },
    //     { Header: "가입방법" },
    //     { Header: "지인" },
    //     { Header: "비고"  },
    //     { Header: "계급" },
    //     { Header: "상태" },
    //     { Header: "수정 / 탈퇴 / 삭제" },
    // ];

    // const withdrawalColumns = [
    //     { Header: "번호" },
    //     { Header: "이름" },
    //     { Header: "가입일" },
    //     { Header: "가입기간" },
    //     { Header: "가입방법" },
    //     { Header: "지인" },
    //     { Header: "비고"  },
    //     { Header: "계급" },
    //     { Header: "상태" },
    //     { Header: "탈퇴사유" },
    //     { Header: "수정 / 탈퇴 / 삭제" },
    // ];

    useEffect(() => {
        const q = query(collection(dbService, "users"), where("status", "==", "정상"), orderBy("rank"));
        const withdrawalQ = query(collection(dbService, "users"), where("status", "==", "탈퇴"), orderBy("rank"));

        onSnapshot(q, (querySnapshot) => {
            const userArray = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));

            setData(userArray);
        });

        onSnapshot(withdrawalQ, (querySnapshot) => {
            const userArray = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));

            setWithdrawalData(userArray);
        });
    }, []);

    return (
        <FlexBox>
            <div>
                {data.map((user, index) => (
                    <UserList
                        statusProp={"정상"}
                        userObj={user}
                        key={user.id}
                        index={index+1}
                    />
                ))}                
            </div>

            <UserAddForm
                userObj={data}
            />

            <div>
                {withdrawaData.map((user, index) => (
                    <UserList
                        statusProp={"탈퇴"}
                        userObj={user}
                        key={user.id}
                        index={index+1}
                    />
                ))}                
            </div>
        </FlexBox>
    );
};

export default UserListPage;