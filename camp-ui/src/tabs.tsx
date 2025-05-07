// tabs.tsx
import { ComponentChildren } from "preact";
import { useState } from "preact/hooks";
import "./tabs.css";
import {CSSProperties} from "preact/compat" // We'll create this CSS file next

interface TabProps {
    name: string;
    children: ComponentChildren;
}

export function Tab({ children }: TabProps) {
    // This is just a container component, the actual rendering is handled by Tabs
    return <div className="tab-content">{children}</div>;
}

interface TabsProps {
    children: ComponentChildren;
    defaultTab?: string; // Optional prop to set which tab is active by default
    style?:CSSProperties;
}

export function Tabs({ children, defaultTab, style }: TabsProps) {
    // Convert children to array for easier handling
    const childrenArray = Array.isArray(children) ? children : [children];
    // Get the names of all tabs
    const tabNames = childrenArray
        .filter(child => child?.type === Tab)
        .map(child => child.props.name);

    // Set the default active tab (first tab if not specified)
    const [activeTab, setActiveTab] = useState(defaultTab || tabNames[0] || "");

    return (
        <div className="tabs-container" style={style}>
            <div className="tabs-header">
                {tabNames.map(name => (
                    <button
                        key={name}
                        className={`tab-button ${activeTab === name ? "active" : ""}`}
                        onClick={() => setActiveTab(name)}
                    >
                        {name}
                    </button>
                ))}
            </div>
            <div className="tabs-content">
                {childrenArray
                    .filter(child => child?.type === Tab && child.props.name === activeTab)
                    .map(child => child)}
            </div>
        </div>
    );
}