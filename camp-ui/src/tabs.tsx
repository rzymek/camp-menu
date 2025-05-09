// tabs.tsx
import React, {useState} from "react"
import "./tabs.css"
import {CSSProperties} from "react" // We'll create this CSS file next

interface TabProps {
    name: string;
    children: React.ReactNode;
}

export function Tab({children}: TabProps) {
    // This is just a container component, the actual rendering is handled by Tabs
    return <div className="tab-content">{children}</div>
}

interface TabsProps {
    children: React.ReactNode;
    defaultTab?: string; // Optional prop to set which tab is active by default
    style?: CSSProperties;
}

export function Tabs({children, defaultTab, style}: TabsProps) {
    const childrenArray = Array.isArray(children) ? children : [children]
    const tabs = childrenArray.flatMap(it => it)
        .filter(child => child?.type === Tab)
    const tabNames = tabs
        .map(child => child.props.name)
    const [activeTab, setActiveTab] = useState(defaultTab || tabNames[0] || "")
    return (
        <div className="tabs-container" style={style}>
            <div className="tabs-header">
                {tabNames.map(name => (
                    <button
                        key={name}
                        className={`tab-button ${activeTab === name ? "active" : ""}`}
                        onClick={() => setActiveTab(name)}>
                        {name}
                    </button>
                ))}
            </div>
            <div className="tabs-content">
                {tabs.map(child =>
                    <div key={child.props.name} style={{
                        display: child.props.name === activeTab
                            ? "block" : "none",
                    }}>{child}</div>,
                )}
            </div>
        </div>
    )
}