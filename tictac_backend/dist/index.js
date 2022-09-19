"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const HTTP = __importStar(require("http"));
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const WinningLogic_1 = __importDefault(require("./WinningLogic"));
const app = (0, express_1.default)();
const PORT = 4000;
// New imports
const http = HTTP.createServer(app);
app.use((0, cors_1.default)());
const socketIO = new socket_io_1.Server(http, {
    cors: {
        origin: "*",
    },
});
let listOfConnection = [];
let listOfActiveGames = [];
// Add this before the app.get() block
socketIO.on("connection", (socket) => __awaiter(void 0, void 0, void 0, function* () {
    listOfConnection.push({ userId: socket.id, userName: "" });
    console.log(listOfConnection);
    console.log(listOfActiveGames);
    socket.on("UserJoined", ({ userId, userName }) => {
        let p1;
        listOfConnection.forEach((item, index) => {
            if (item.userId === userId) {
                item.userName = userName;
                p1 = item;
            }
        });
        listOfActiveGames.push({
            player1: p1,
            player2: null,
            gameId: Math.random().toString(36).slice(2, 7),
            gameMatrix: [[], [], []],
            turn: "",
            winner: null,
            player1WinCount: 0,
            player2WinCount: 0
        });
        socket.broadcast.emit("UserAddedToList", { listOfConnection, listOfActiveGames });
        console.log(listOfConnection);
    });
    socket.on("joinGame", (gameId) => {
        let requestedGame;
        let p2;
        listOfConnection.forEach((item, index) => {
            if (item.userId === socket.id) {
                item.userName = gameId.player2Name;
                p2 = item;
                console.log(gameId.player2Name);
                console.log(item);
            }
            ;
        });
        listOfActiveGames.forEach((item, index) => {
            if (item.gameId === gameId.gameId) {
                item.player2 = p2;
                requestedGame = item;
            }
        });
        if (requestedGame) {
            requestedGame.player2 = p2;
            requestedGame.turn = requestedGame.player2.userId;
            console.log(requestedGame);
            socketIO.to(requestedGame.player1.userId).emit("getGameData", requestedGame);
            socket.emit("getGameData", requestedGame);
        }
    });
    socket.on("moveMade", (gameData) => {
        const gameId = gameData.gameId;
        let requestedGame;
        listOfActiveGames.forEach((item, index) => {
            if (item.gameId === gameId) {
                item.gameMatrix = gameData.gameMatrix;
                item.turn = gameData.turn;
                item.winner = (0, WinningLogic_1.default)(gameData).winConnection;
                item.player1WinCount = (0, WinningLogic_1.default)(gameData).player1WinCount;
                item.player2WinCount = (0, WinningLogic_1.default)(gameData).player2WinCount;
                if (item.winner)
                    item.turn = "";
                requestedGame = item;
            }
        });
        if (requestedGame) {
            socketIO.to(requestedGame.player1.userId).emit("getGameData", requestedGame);
            socketIO.to(requestedGame.player2.userId).emit("getGameData", requestedGame);
        }
    });
    socket.on("clearGame", (gameData) => {
        const gameId = gameData.gameId;
        let requestedGame;
        listOfActiveGames.forEach((item, index) => {
            if (item.gameId === gameId) {
                item.gameMatrix = [[], [], []];
                item.turn = socket.id;
                item.winner = null;
                requestedGame = item;
            }
        });
        socketIO.to(requestedGame.player1.userId).emit("getGameData", requestedGame);
        socketIO.to(requestedGame.player2.userId).emit("getGameData", requestedGame);
    });
    // console.log(`⚡: ${socket.id} user just connected!`);
    socket.on("disconnect", () => {
        const modifiedArray = listOfConnection.filter((item, index) => {
            if (item.userId !== socket.id)
                return true;
            else
                return false;
        });
        listOfConnection = modifiedArray;
        const modifiedGameArray = listOfActiveGames.filter((item, index) => {
            var _a;
            if (((_a = item.player1) === null || _a === void 0 ? void 0 : _a.userId) !== socket.id)
                return true;
            else
                return false;
        });
        listOfActiveGames = modifiedGameArray;
        socket.broadcast.emit("UserAddedToList", { listOfConnection, listOfActiveGames });
        console.log(listOfConnection);
        console.log("🔥: A user disconnected");
    });
}));
app.get("/api/getActiveUsers", (req, res) => {
    socketIO.emit("UserAddedToList", { listOfConnection, listOfActiveGames });
    res.json({
        listOfActiveGames,
        listOfConnection
    });
});
app.get("/api", (req, res) => {
    res.json({
        message: "Hello world",
    });
});
http.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});
//# sourceMappingURL=index.js.map