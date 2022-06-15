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