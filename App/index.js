// Filename: index.js
// Combined code from all files

import React, { useState, useEffect, useCallback } from 'react';
import { SafeAreaView, StyleSheet, View, Text, Button, TouchableOpacity, Dimensions } from 'react-native';
import { gestureHandlerRootHOC, PanGestureHandler, State } from 'react-native-gesture-handler';

const CELL_SIZE = 20;
const BOARD_SIZE = Dimensions.get('window').width - 40;

const initialSnake = [{ x: 0, y: 0 }];
const initialFood = {
    x: Math.floor(Math.random() * (BOARD_SIZE / CELL_SIZE)) * CELL_SIZE,
    y: Math.floor(Math.random() * (BOARD_SIZE / CELL_SIZE)) * CELL_SIZE,
};

const SnakeGame = () => {
    const [snake, setSnake] = useState(initialSnake);
    const [food, setFood] = useState(initialFood);
    const [direction, setDirection] = useState({ x: 1, y: 0 });
    const [gameOver, setGameOver] = useState(false);

    useEffect(() => {
        if (gameOver) return;

        const interval = setInterval(() => {
            moveSnake();
        }, 200);

        return () => clearInterval(interval);
    }, [snake, direction, gameOver]);

    const moveSnake = useCallback(() => {
        setSnake((prevSnake) => {
            const newHead = {
                x: prevSnake[0].x + direction.x * CELL_SIZE,
                y: prevSnake[0].y + direction.y * CELL_SIZE,
            };

            if (newHead.x < 0 || newHead.x >= BOARD_SIZE || newHead.y < 0 || newHead.y >= BOARD_SIZE) {
                setGameOver(true);
                return prevSnake;
            }

            for (let segment of prevSnake) {
                if (newHead.x === segment.x && newHead.y === segment.y) {
                    setGameOver(true);
                    return prevSnake;
                }
            }

            const newSnake = [newHead, ...prevSnake];

            if (newHead.x === food.x && newHead.y === food.y) {
                setFood({
                    x: Math.floor(Math.random() * (BOARD_SIZE / CELL_SIZE)) * CELL_SIZE,
                    y: Math.floor(Math.random() * (BOARD_SIZE / CELL_SIZE)) * CELL_SIZE,
                });
                return newSnake;
            } else {
                newSnake.pop();
                return newSnake;
            }
        });
    }, [direction, food]);

    const handlePanGesture = ({ nativeEvent }) => {
        if (nativeEvent.state === State.ACTIVE) {
            const { translationX, translationY } = nativeEvent;

            if (Math.abs(translationX) > Math.abs(translationY)) {
                setDirection({
                    x: translationX > 0 ? 1 : -1,
                    y: 0,
                });
            } else {
                setDirection({
                    x: 0,
                    y: translationY > 0 ? 1 : -1,
                });
            }
        }
    };

    const resetGame = () => {
        setSnake(initialSnake);
        setFood(initialFood);
        setDirection({ x: 1, y: 0 });
        setGameOver(false);
    };

    return (
        <View style={styles.gameContainer}>
            {gameOver && (
                <View style={styles.overlay}>
                    <Text style={styles.gameOverText}>Game Over</Text>
                    <Button onPress={resetGame} title="Restart" color="#841584" />
                </View>
            )}
            <PanGestureHandler onGestureEvent={handlePanGesture}>
                <View style={styles.board}>
                    {snake.map((segment, index) => (
                        <View
                            key={index}
                            style={[
                                styles.snakeSegment,
                                { left: segment.x, top: segment.y },
                            ]}
                        />
                    ))}
                    <View style={[styles.food, { left: food.x, top: food.y }]} />
                </View>
            </PanGestureHandler>
        </View>
    );
};

const styles = StyleSheet.create({
    gameContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    board: {
        width: BOARD_SIZE,
        height: BOARD_SIZE,
        backgroundColor: '#000',
        overflow: 'hidden',
        borderColor: '#888',
        borderWidth: 5,
        position: 'relative',
    },
    snakeSegment: {
        position: 'absolute',
        width: CELL_SIZE,
        height: CELL_SIZE,
        backgroundColor: 'green',
    },
    food: {
        position: 'absolute',
        width: CELL_SIZE,
        height: CELL_SIZE,
        backgroundColor: 'red',
    },
    overlay: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    gameOverText: {
        fontSize: 32,
        color: 'white',
        marginBottom: 20,
    },
});

const App = gestureHandlerRootHOC(function App() {
    return (
        <SafeAreaView style={appStyles.container}>
            <Text style={appStyles.title}>Snake Game</Text>
            <SnakeGame />
        </SafeAreaView>
    );
});

const appStyles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 20,
        backgroundColor: '#f0f0f0',
        padding: 16,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
});

export default App;