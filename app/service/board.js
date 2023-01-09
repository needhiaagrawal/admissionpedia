import Board from "../models/board";

export const getBoardList = async () => {
    let boardsList = await Board.findAll({ raw: false });
    return boardsList
}