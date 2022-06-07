import UserTable from "../components/UserTable";

const DashBoard = () => {
    const columns = [
        { Header: "번호" },
        { Header: "이름" },
        { Header: "가입일" },
        { Header: "가입기간" },
        { Header: "가입방법" },
        { Header: "지인" },
        { Header: "비고" },
        { Header: "계급" },
        { Header: "수정 / 탈퇴 / 삭제" },
        { Header: "상태" },
    ];
    
    return (
        <div>
            <UserTable
                columns={columns}
                statusProp={"정상"}
            />

            <UserTable
                columns={columns}
                statusProp={"탈퇴"}
            />
        </div>
    );
};

export default DashBoard;