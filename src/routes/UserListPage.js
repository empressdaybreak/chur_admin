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
    display: grid;
    grid-template-columns: repeat(11, 1fr);
    align-items: center;

    border: none;
    box-shadow: 0 2px 10px rgb(0 0 0 / 10%);
    border-radius: 5px;
    background-color: #fff;

    font-size: 20px;
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

const AlertDesc = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;

    & > p {
        font-size: 20px;
        margin-top: 30px;
    }
`;

// const Select = styled.select`
//     border: 1px solid #dadada;
//     border-radius: 5px;

//     padding: 10px;
//     margin-right: 10px;

//     &:focus {
//         outline: none;
//     }
// `;

const UserListPage = ({ status, userObj }) => {
    const [data, setData] = useState([]);
    // const [searchText, setSearchText] = useState("");
    // const rankSelect = ["계급", "1.킹냥이", "2.운영냥이", "3.집냥이", "4.뚱냥이", "5.아기냥이", "6.식빵굽는중"];

    // 이름 검색 기능
    // const doSearch = async (flag) => {
    //     const q = query(collection(dbService, "users"), where(flag === "search" ? "name" : "status", "==", flag === "search" ? searchText : "정상"), orderBy("rank"));
        
    //     onSnapshot(q, (querySnapshot) => {
    //         const userArray = querySnapshot.docs.map(doc => ({
    //             id: doc.id,
    //             ...doc.data(),
    //         }));

    //         setData(userArray);
    //     });
    // };

    // 계급을 이용한 필터링 검색
    // const onChange = (event) => {
    //     const { target: { value } } = event;
    //     let q = "";

    //     if (value === "전체") {
    //         q = query(collection(dbService, "users"), where("status", "==", "정상"), orderBy("rank"));
    //     } else {
    //         q = query(collection(dbService, "users"), where("rank", "==", value), where("status", "==", "정상"));
    //     }
        
    //     onSnapshot(q, (querySnapshot) => {
    //         const userArray = querySnapshot.docs.map(doc => ({
    //             id: doc.id,
    //             ...doc.data(),
    //         }));

    //         setData(userArray);
    //     });
    // };

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
                <>
                    <UserCounter userData={data} />
                    <UserAddForm userObj={userObj}/>
                </>
            }
            
            <UserHeader>
                <p>번호</p>
                <p>이름</p>
                <p>가입일자</p>
                <p>{status ? "가입일" : "탈퇴일자"}</p>
                <p>가입경로</p>
                <p>지인</p>
                <p>비고</p>
                <p>계급</p>
                <p>상태</p>
                <p>탈퇴사유</p>
                <p>버튼</p>
            </UserHeader>

            {/* <in put type="text" onChange={onChange} value={searchText} />
            <p onClick={() => doSearch("search")}>검색</p>
            <p onClick={() => doSearch("reset")}>초기화</p> */}

            {/* <Select onChange={onChange}>
                {rankSelect.map((data, index) => (
                    <option key={index} value={data}>
                        {data}
                    </option>
                ))}
            </Select> */}
            
            <div>
                {data.map((user, index) => (
                    <UserList
                        statusProp={status ? "정상" : "탈퇴"}
                        userData={user}
                        userObj={userObj}
                        key={user.id}
                        index={index+1}
                    />
                ))}

                {/* 유저가 한명도 없을 때 */}
                {data.length === 0 && 
                    <AlertDesc>
                        <p>등록된 냥이가 없습니다.</p>
                    </AlertDesc>
                }
            </div>
        </FlexBox>
    );
};

export default UserListPage;