import * as React from "react";
import { StatusBar } from "expo-status-bar";
import { Button, SafeAreaView, StyleSheet, Text, View } from "react-native";
import Card from "./Card";

const levels = [
    { cards: ["👩‍💻", "🗣️", "🦷", "🍑"], cardsPerLevel: 4 },
    { cards: ["🥕", "🥑", "👻", "🥶", "🥵"], cardsPerLevel: 5 },
    { cards: ["🌪️", "🌎", "🐷", "🍉", "⚛️", "🔑"], cardsPerLevel: 6 },
];

export default function App() {
    const [level, setLevel] = React.useState(0);
    const currentLevel = levels[level];
    const [board, setBoard] = React.useState(() =>
        shuffle([...currentLevel.cards, ...currentLevel.cards])
    );
    const [selectedCards, setSelectedCards] = React.useState([]);
    const [matchedCards, setMatchedCards] = React.useState([]);
    const [score, setScore] = React.useState(0);
    const [failedAttempts, setFailedAttempts] = React.useState(0);

    React.useEffect(() => {
        if (selectedCards.length < 2) return;

        if (board[selectedCards[0]] === board[selectedCards[1]]) {
            setMatchedCards([...matchedCards, ...selectedCards]);
            setSelectedCards([]);
        } else {
            const timeoutId = setTimeout(() => {
                setSelectedCards([]);
                setFailedAttempts(failedAttempts + 1);
            }, 700);
            return () => clearTimeout(timeoutId);
        }
    }, [selectedCards]);

    const handleTapCard = (index) => {
        if (selectedCards.length >= 2 || selectedCards.includes(index)) return;
        setSelectedCards([...selectedCards, index]);
    };

    const didPlayerWin = () => matchedCards.length === board.length;

    const resetGame = () => {
        setScore(0);
        setSelectedCards([]);
        setMatchedCards([]);
        setFailedAttempts(0);

        if (level < levels.length - 1) {
            // Si hay más niveles, aumenta el nivel.
            setLevel(level + 1);
            // Reinicia el tablero con las cartas del nuevo nivel.
            const nextLevel = levels[level + 1];
            setBoard(shuffle([...nextLevel.cards, ...nextLevel.cards]));
        } else {
            // Si no hay más niveles, reinicia el juego desde el primer nivel.
            setLevel(0);
            const firstLevel = levels[0];
            setBoard(shuffle([...firstLevel.cards, ...firstLevel.cards]));
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>
                {didPlayerWin()
                    ? level === levels.length - 1
                        ? "Felicidades Ganaste 🎉"
                        : "Nivel Completado"
                    : "Memorama - Nivel " + (level + 1)}
            </Text>
            <Text style={styles.title}>Intentos fallidos: {failedAttempts}</Text>
            <View style={styles.board}>
                {board.map((card, index) => {
                    const isTurnedOver =
                        selectedCards.includes(index) || matchedCards.includes(index);
                    return (
                        <Card
                            key={index}
                            isTurnedOver={isTurnedOver}
                            onPress={() => handleTapCard(index)}
                        >
                            {card}
                        </Card>
                    );
                })}
            </View>
            {didPlayerWin() && <Button onPress={resetGame} title="Siguiente Nivel" />}
            <StatusBar style="light" />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#37738E",
        alignItems: "center",
        justifyContent: "start",
        paddingTop: 45,
    },
    board: {
        flexDirection: "row",
        justifyContent: "center",
        flexWrap: "wrap",
    },
    title: {
        fontSize: 32,
        fontWeight: "900",
        color: "snow",
        marginVertical: 15,
    },
});

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const randomIndex = Math.floor(Math.random() * (i + 1));

        // Swap the elements at i and randomIndex
        [array[i], array[randomIndex]] = [array[randomIndex], array[i]];
    }
    return array;
}
