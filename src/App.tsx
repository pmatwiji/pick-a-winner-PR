import { CloseOutlined, UploadOutlined } from "@ant-design/icons";
import {
    Button,
    Image,
    Input,
    List,
    Modal,
    Row,
    Tooltip,
    Typography,
} from "antd";
import { Col } from "antd/es/grid";
import { FC, useState } from "react";
import * as XLSX from "xlsx";
import Logo from "../src/assets/logo-white.png";
import Medal from "../src/assets/medal.png";
import Trophy from "../src/assets/trophy.png";
import "./App.css";
import Confetti from "./components/Confetti/Confetti";
import { IUser } from "./models/users";

const App: FC = () => {
    const [participants, setParticipants] = useState<IUser[]>([]);
    const [inputValue, setInputValue] = useState<string>();
    const [isPushing, setIsPushing] = useState<boolean>(false);
    const [isPickingWinner, setIsPickingWinner] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);
    const [winner, setWinner] = useState<IUser>();
    const [status, setStatus] = useState<any>("");

    const handleInput = (value: string) => {
        if (value.length > 0) setStatus("");
        else setStatus("error");
        setInputValue(value);
    };

    const handleAddParticipant = () => {
        if (inputValue) {
            setIsPushing(true);
            participants.push({
                id:
                    participants.length > 0
                        ? participants[participants.length - 1].id + 1
                        : 1,
                name: inputValue,
            });
        } else {
            setStatus("error");
        }
        setInputValue("");
        setIsPushing(false);
    };

    const handleDelete = (item: IUser) => {
        setParticipants(participants.filter((x) => x.id !== item.id));
    };

    const handlePickWinner = () => {
        setIsPickingWinner(true);
        const winner: IUser =
            participants[Math.floor(Math.random() * participants.length)];
        setTimeout(() => {
            setOpen(true);
            setIsPickingWinner(false);
            setWinner(winner);
        }, 2000);
    };

    const handleOk = () => {
        setOpen(false);
    };

    const handleCancel = () => {
        setOpen(false);
    };

    const handleFileUpload = (e: any) => {
        let users: IUser[] = [];
        const reader = new FileReader();
        reader.readAsBinaryString(e.target.files[0]);
        reader.onload = (e) => {
            const data = e.target?.result;
            const workbook = XLSX.read(data, { type: "binary" });
            const sheetname = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetname];
            const parsedData = XLSX.utils.sheet_to_json(sheet);
            parsedData.forEach((row: any, index: any) => {
                Object.values(row).map((value: any) =>
                    users.push({
                        id: index,
                        name: value,
                    })
                );
            });
            setParticipants(users);
        };
    };

    return (
        <div className="app">
            {open ? <Confetti /> : null}
            <Row justify="center" align="middle">
                <Col span={24} className="logo__container">
                    <Image src={Logo} preview={false} width={"15vw"} />
                </Col>
            </Row>
            <Row className="main__container">
                <Col span={14} className="picker__container">
                    <Image src={Trophy} preview={false} width={"25vw"} />
                    <div className="content__container">
                        <ul
                            className={
                                "content__container__list " +
                                (isPickingWinner
                                    ? "fast_change"
                                    : "slow_change")
                            }
                        >
                            {participants.map((participant) => (
                                <li className="content__container__list__item ">
                                    {participant.name}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <Row>
                        <Button
                            className="winner_btn"
                            type="primary"
                            size="large"
                            onClick={handlePickWinner}
                            loading={isPickingWinner}
                        >
                            Seleccione un ganador 🏆
                        </Button>
                    </Row>
                </Col>
                <Col span={10}>
                    <List
                        className="users__list"
                        bordered
                        dataSource={participants}
                        renderItem={(item) => (
                            <List.Item
                                style={{
                                    overflowX: "hidden",
                                    textOverflow: "ellipsis",
                                }}
                                actions={[
                                    <Tooltip title="Eliminar">
                                        <Button
                                            type="primary"
                                            danger
                                            shape="circle"
                                            size="small"
                                            icon={
                                                <CloseOutlined
                                                    style={{
                                                        strokeWidth: "50",
                                                        stroke: "white",
                                                        fontSize: "12px",
                                                    }}
                                                />
                                            }
                                            onClick={() => handleDelete(item)}
                                        />
                                    </Tooltip>,
                                ]}
                            >
                                {item.name}
                            </List.Item>
                        )}
                    />
                    <Input
                        placeholder="Agregar participante"
                        onChange={(e) => handleInput(e.target.value)}
                        value={inputValue}
                        status={status}
                        onBlur={() => setStatus("")}
                    />
                    <Row>
                        {status === "error" && (
                            <Typography.Text
                                style={{ color: "#ff0000", fontSize: "12px" }}
                            >
                                Ingrese un nombre, por favor
                            </Typography.Text>
                        )}
                    </Row>
                    <Row gutter={12}>
                        <Col span={8}>
                            <Button
                                className="add_btn"
                                type="primary"
                                onClick={handleAddParticipant}
                                loading={isPushing}
                            >
                                Agregar
                            </Button>
                        </Col>
                        <Col
                            span={16}
                            style={{
                                display: "flex",
                                justifyContent: "flex-end",
                            }}
                        >
                            <Button className="add_btn" type="primary">
                                <label
                                    htmlFor="file-upload"
                                    style={{ marginTop: "1rem" }}
                                >
                                    <UploadOutlined /> Importar listado
                                </label>
                                <Input
                                    id="file-upload"
                                    style={{ display: "none" }}
                                    type="file"
                                    onChange={handleFileUpload}
                                />
                            </Button>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Modal
                open={open}
                onOk={handleOk}
                onCancel={handleCancel}
                centered
                mask
                maskClosable={false}
                footer={null}
            >
                <div className="modal">
                    <Image src={Medal} preview={false} width={"10vw"} />
                    <Typography.Title style={{ margin: 0 }}>
                        Felicitaciones
                    </Typography.Title>
                    <Typography.Text strong style={{ fontSize: "1.5rem" }}>
                        {winner?.name}
                    </Typography.Text>
                </div>
            </Modal>
        </div>
    );
};

export default App;
