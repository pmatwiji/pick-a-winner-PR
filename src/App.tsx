import { FC, useEffect, useState } from "react";
import "./App.css";
import {
    Row,
    Image,
    List,
    Typography,
    Input,
    Button,
    Tooltip,
    Modal,
} from "antd";
import { Col } from "antd/es/grid";
import Logo from "../src/assets/logo-white.png";
import Trophy from "../src/assets/trophy.png";
import Medal from "../src/assets/medal.png";
import { confirmedUsers } from "./mocks/confirmedUsers";
import { IUser } from "./models/users";
import { CloseOutlined } from "@ant-design/icons";
import Confetti from "./components/Confetti/Confetti";

const App: FC = () => {
    const [participants, setParticipants] = useState<IUser[]>([]);
    const [inputValue, setInputValue] = useState<string>();
    const [isPushing, setIsPushing] = useState<boolean>(false);
    const [isPickingWinner, setIsPickingWinner] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);
    const [winner, setWinner] = useState<IUser>();
    const [status, setStatus] = useState<any>("");

    useEffect(() => {
        setParticipants(confirmedUsers);
    }, []);

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
                    <Button
                        className="add_btn"
                        type="primary"
                        onClick={handleAddParticipant}
                        loading={isPushing}
                    >
                        Agregar
                    </Button>
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
