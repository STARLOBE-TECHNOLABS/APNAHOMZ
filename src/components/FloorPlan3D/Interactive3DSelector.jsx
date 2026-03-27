import React, { useRef, useState, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Center, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { BiX, BiCheck } from 'react-icons/bi';

// Helper to draw items in 3D
const MiniItem = ({ item, isSelected, onClick }) => {
    const meshRef = useRef();

    return (
        <mesh
            ref={meshRef}
            position={[item.x + (item.width || 1) / 2, (item.depth || 1) / 2, item.y + (item.height || 1) / 2]}
            onClick={(e) => {
                e.stopPropagation();
                onClick(item);
            }}
        >
            <boxGeometry args={[item.width || 1, item.depth || 1, item.height || 1]} />
            <meshStandardMaterial
                color={isSelected ? '#a855f7' : '#e2e8f0'}
                emissive={isSelected ? '#9333ea' : '#000000'}
                emissiveIntensity={isSelected ? 0.5 : 0}
                transparent
                opacity={isSelected ? 0.9 : 0.6}
            />
            {isSelected && (
                <lineSegments>
                    <edgesGeometry args={[new THREE.BoxGeometry(item.width || 1, item.depth || 1, item.height || 1)]} />
                    <lineBasicMaterial color="#ffffff" linewidth={2} />
                </lineSegments>
            )}
        </mesh>
    );
};

const Interactive3DSelector = ({ plan, onConfirm, onCancel }) => {
    const [selectedItems, setSelectedItems] = useState([]);
    const [viewAngle, setViewAngle] = useState('front'); // front, back, left, right

    const items = plan?.items || [];
    // plan.walls is an array of wall groups, we need to flatten it to get individual walls
    const walls = plan?.walls ? plan.walls.flatMap(group => group.walls || []) : [];

    const handleItemClick = (item) => {
        setSelectedItems(prev => {
            const exists = prev.find(i => i.id === item.id);
            if (exists) {
                return prev.filter(i => i.id !== item.id);
            } else {
                return [...prev, item];
            }
        });
    };

    const handleConfirm = () => {
        onConfirm({
            selectedItems,
            viewAngle
        });
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-[80vh] flex flex-col overflow-hidden">

                {/* Header */}
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">Interactive 3D Selection</h2>
                        <p className="text-sm text-gray-500">Click multiple items to group them. Select viewing angle.</p>
                    </div>
                    <button onClick={onCancel} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                        <BiX size={24} className="text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 flex overflow-hidden">

                    {/* 3D Canvas View */}
                    <div className="flex-1 bg-gray-900 relative">
                        <Canvas camera={{ position: [0, 15, 15], fov: 50 }}>
                            <ambientLight intensity={0.5} />
                            <directionalLight position={[10, 10, 5]} intensity={1} />
                            <Environment preset="city" />

                            <Center>
                                <group>
                                    {/* Draw Floor */}
                                    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
                                        <planeGeometry args={[50, 50]} />
                                        <meshStandardMaterial color="#334155" />
                                    </mesh>

                                    {/* Draw Walls */}
                                    {walls.map((wall, i) => {
                                        const dx = wall.x2 - wall.x1;
                                        const dy = wall.y2 - wall.y1;
                                        const length = Math.sqrt(dx * dx + dy * dy);
                                        const angle = Math.atan2(dy, dx);
                                        const cx = wall.x1 + dx / 2;
                                        const cy = wall.y1 + dy / 2;

                                        return (
                                            <mesh
                                                key={`wall-${i}`}
                                                position={[cx, 1.5, cy]}
                                                rotation={[0, -angle, 0]}
                                            >
                                                <boxGeometry args={[length, 3, 0.2]} />
                                                <meshStandardMaterial color="#475569" transparent opacity={0.5} />
                                            </mesh>
                                        );
                                    })}

                                    {/* Draw Items */}
                                    {items.map((item, i) => (
                                        <MiniItem
                                            key={item.id || i}
                                            item={item}
                                            isSelected={selectedItems.some(sel => sel.id === item.id)}
                                            onClick={handleItemClick}
                                        />
                                    ))}
                                </group>
                            </Center>
                            <OrbitControls makeDefault />
                        </Canvas>

                        {/* Selection Overlay stats */}
                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md p-3 rounded-lg shadow-lg pointer-events-none">
                            <p className="font-bold text-indigo-900">Items Selected: {selectedItems.length}</p>
                        </div>
                    </div>

                    {/* Sidebar Controls */}
                    <div className="w-80 bg-white border-l border-gray-100 p-6 flex flex-col overflow-y-auto">
                        <h3 className="font-bold text-gray-800 mb-4">Viewing Options</h3>

                        <div className="space-y-3 mb-8">
                            <p className="text-sm font-medium text-gray-600 mb-2">Direction to face selection:</p>

                            {['front', 'back', 'left', 'right'].map((dir) => (
                                <label key={dir} className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all ${viewAngle === dir ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-gray-300'}`}>
                                    <input
                                        type="radio"
                                        name="viewAngle"
                                        value={dir}
                                        checked={viewAngle === dir}
                                        onChange={(e) => setViewAngle(e.target.value)}
                                        className="hidden"
                                    />
                                    <div className={`w-4 h-4 rounded-full border border-gray-300 mr-3 flex items-center justify-center ${viewAngle === dir ? 'bg-indigo-500 border-indigo-500' : ''}`}>
                                        {viewAngle === dir && <div className="w-2 h-2 rounded-full bg-white" />}
                                    </div>
                                    <span className="capitalize font-medium text-gray-700">{dir} Side</span>
                                </label>
                            ))}
                        </div>

                        <div className="mt-auto pt-4 border-t border-gray-100">
                            <button
                                disabled={selectedItems.length === 0}
                                onClick={handleConfirm}
                                className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 shadow-lg shadow-indigo-200"
                            >
                                <BiCheck size={20} />
                                Confirm Capture Source
                            </button>
                            {selectedItems.length === 0 && (
                                <p className="text-xs text-center text-red-500 mt-2">Please select at least 1 item</p>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Interactive3DSelector;
