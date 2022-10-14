import React, {useEffect, useState} from "react";
import styled from "styled-components";
import TitleWithText from "../components/TitleWithText";
import {collection, onSnapshot, orderBy, query} from "firebase/firestore";
import {dbService} from "../fbase";

const Home = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const q = query(collection(dbService, "logs"), orderBy("date", "desc"));

        onSnapshot(q, (querySnapshot) => {
            const logArray = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                date: doc.data().date.toDate(),
            }));

            setData(logArray);
        });
    }, []);

    return (
        <GridContainer>
            <TitleWithText title="활동 내역" type="log" data={data} />

            <TitleWithText title="각 메뉴 설명" type="text">
                <p>냥이관리<br />- 부대에 있는 인원 목록 및 관리 할 수 있는 메뉴 입니다.</p>
                <br />
                <p>탈퇴한냥이<br />- 부대에서 탈퇴한 인원 목록 및 관리 할 수 있는 메뉴 입니다.</p>
                <br />
                <p>건의사항<br />- 회의가 필요한 안건이나 운영진 개인적으로 건의를 하는 메뉴 입니다.</p>
                <br />
                <p>회의록<br />- 운영진 회의가 있을 때 기록을 남겨두어 언제든 확인 할 수 있는 메뉴 입니다.</p>
                <br /><br />
                <p>이외에 필요한 메뉴나 필요한 기능이 있다면 "토꾸'당근가게" 에게 문의 주세요.</p>
            </TitleWithText>
        </GridContainer>
    );
};

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
`;

export default Home;
