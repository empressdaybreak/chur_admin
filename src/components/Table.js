import React, { useEffect, useState } from "react";
import { addDoc, collection, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { dbService } from "../fbase";
import moment from "moment";
import "moment/locale/ko";

const Table = () => { 
    // 이름
    const [name, setName] = useState(""); 

    // 가입일
    const [date, setDate] = useState(moment().format("YYYY-MM-DD")); 

    // 가입기간
    const [day, setDay] = useState(""); 

    // 가입경로
    const [root, setRoot] = useState("인벤");

    // 지인
    const [partner, setPartner] = useState("");

    // 기타 / 비고
    const [etc, setEtc] = useState("");
    
    // 계급
    const [rank, setRank] = useState("아기냥이");

    // firestore에서 불러온 데이터 배열
    const [data, setData] = useState([]);

    const rootSelect = ["인벤", "공홈", "지인"];
    const rankSelect = ["킹냥이", "집냥이", "뚱냥이", "아기냥이"];

    const columns = [
        { Header: "번호" },
        { Header: "이름" },
        { Header: "가입일" },
        { Header: "가입기간" },
        { Header: "가입방법" },
        { Header: "지인" },
        { Header: "비고" },
        { Header: "계급" }
    ];

    const onChange = (event) => {
        const { target: { value, name } } = event;
        
        console.log(name);

        if (name === "name") {
            setName(value);
        } else if (name === "date") {
            setDate(value);
        } else if (name === "day") {
            setDay(value);
        } else if (name === "root") {
            setRoot(value);
        } else if (name === "partner") {
            setPartner(value);
        } else if (name === "etc") {
            setEtc(value);
        } else if (name === "rank") {
            setRank(value);
        }
    };

    const onSubmit = async (event) => {
        event.preventDefault();

        const userDataObj = {
            name: name,
            regist_date: date,
            regist_day: day,
            regist_root: root,
            partner: partner,
            etc: etc,
            rank: rank
        };

        await addDoc(collection(dbService, "users"), userDataObj);
    };

    const onDeleteClick = async (id) => {
        const ok = window.confirm("삭제하시겠습니까?");

        if (ok) {
            await deleteDoc(doc(dbService, "users", id));
        }
    };

    const handleSelect = (event) => {
        const { target: { value, name } } = event;

        if (name === "rootSelect") {
            setRoot(value);
        } else if(name === "rankSelect") {
            setRank(value);
        }
    }

    useEffect(() => {
        onSnapshot(collection(dbService, "users"), (snapshot) => {
            const userArray = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setData(userArray);
        });
    }, []);
    
    return (
        <>
            <table>
                <thead>
                    <tr>
                        {columns.map((column, index) => (
                            <th key={index}>
                                { column.Header }
                            </th>  
                        ))}

                        <th>수정 / 삭제</th>
                    </tr>
                </thead>

                <tbody>
                    {data.map((data, index) => (
                        <tr key={index}>
                            <td>{ index + 1 }</td>
                            <td>{ data.name }</td>
                            <td>{ data.regist_date }</td>
                            <td>{ moment(date).diff(moment(`${data.regist_date}`), "days") }</td>
                            <td>{ data.regist_root }</td>
                            <td>{ data.partner }</td>
                            <td>{ data.etc }</td>
                            <td>{ data.rank }</td>
                            <td>
                                <button>수정</button>
                                <button onClick={() => onDeleteClick(data.id)}>삭제</button>
                            </td>                        
                        </tr>
                    )) }
                </tbody>
            </table>

            <form onSubmit={onSubmit}>
                <input type="text" name="name" value={name} onChange={onChange} placeholder="이름" />

                <select value={root} onChange={ handleSelect } name="rootSelect">
                    {rootSelect.map((data, index) => (
                        <option key={index} value={ data }>
                            { data }
                        </option>
                    ))}
                </select>

                <input type="text" name="partner" value={partner} onChange={onChange} placeholder="지인" />
                <input type="text" name="etc" value={etc} onChange={onChange} placeholder="비고" />

                <select value={rank} onChange={ handleSelect } name="rankSelect">
                    {rankSelect.map((data, index) => (
                        <option key={index} value={ data }>
                            { data }
                        </option>
                    ))}
                </select>

                <input type="submit" value="등록" />
            </form>
        </>
    );
};

export default Table;