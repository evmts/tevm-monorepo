"use client"

import type React from "react"

import { useState } from "react"
import { FileIcon, FolderIcon, ChevronDown, ChevronRight, List, FileText } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface FileTreeItem {
  name: string
  type: "file" | "folder"
  children?: FileTreeItem[]
}

interface OutlineItem {
  name: string
  type: string
  line: number
}

interface SidebarProps {
  width: number
  onResize: (width: number) => void
  activeView: "files" | "outline"
  onChangeView: (view: "files" | "outline") => void
  fileTree: FileTreeItem[]
  outline: OutlineItem[]
}

export function Sidebar({ width, onResize, activeView, onChangeView, fileTree, outline }: SidebarProps) {
  const [resizing, setResizing] = useState(false)
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    contracts: true,
    scripts: false,
    test: false,
  })

  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault()
    setResizing(true)

    const startX = e.clientX
    const startWidth = width

    const handleMouseMove = (e: MouseEvent) => {
      const newWidth = Math.max(200, Math.min(400, startWidth + e.clientX - startX))
      onResize(newWidth)
    }

    const handleMouseUp = () => {
      setResizing(false)
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)
  }

  const toggleFolder = (folderName: string) => {
    setExpandedFolders((prev) => ({
      ...prev,
      [folderName]: !prev[folderName],
    }))
  }

  const renderFileTree = (items: FileTreeItem[], path = "") => {
    return items.map((item) => {
      const itemPath = path ? `${path}/${item.name}` : item.name

      if (item.type === "folder") {
        const isExpanded = expandedFolders[itemPath] || false

        return (
          <div key={itemPath} className="select-none">
            <div
              className="flex items-center py-1 px-2 hover:bg-highlight-line rounded cursor-pointer"
              onClick={() => toggleFolder(itemPath)}
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4 mr-1 flex-shrink-0" />
              ) : (
                <ChevronRight className="h-4 w-4 mr-1 flex-shrink-0" />
              )}
              <FolderIcon className="h-4 w-4 mr-2 text-yellow-400" />
              <span className="truncate">{item.name}</span>
            </div>

            {isExpanded && item.children && (
              <div className="pl-4 border-l border-highlight-line ml-3">{renderFileTree(item.children, itemPath)}</div>
            )}
          </div>
        )
      } else {
        return (
          <div
            key={itemPath}
            className="flex items-center py-1 px-2 hover:bg-highlight-line rounded cursor-pointer ml-6"
          >
            <FileIcon className="h-4 w-4 mr-2 text-blue-400" />
            <span className="truncate">{item.name}</span>
          </div>
        )
      }
    })
  }

  const renderOutline = (items: OutlineItem[]) => {
    return items.map((item) => {
      let icon
      switch (item.type) {
        case "contract":
          icon = <FileText className="h-4 w-4 mr-2 text-purple-400" />
          break
        case "function":
          icon = <span className="text-green-400 mr-2 font-mono text-xs">fn</span>
          break
        case "event":
          icon = <span className="text-yellow-400 mr-2 font-mono text-xs">ev</span>
          break
        default:
          icon = <span className="text-blue-400 mr-2 font-mono text-xs">var</span>
      }

      return (
        <div
          key={`${item.name}-${item.line}`}
          className="flex items-center py-1 px-2 hover:bg-highlight-line rounded cursor-pointer"
        >
          {icon}
          <span className="truncate">{item.name}</span>
          <span className="ml-auto text-text-secondary text-xs">{item.line}</span>
        </div>
      )
    })
  }

  return (
    <div
      className="flex-shrink-0 bg-bg-panel border-r border-highlight-line relative"
      style={{ width: `${width}px` }}
      role="navigation"
      aria-label="Sidebar"
    >
      <Tabs value={activeView} onValueChange={(v) => onChangeView(v as "files" | "outline")}>
        <TabsList className="w-full">
          <TabsTrigger value="files" className="flex-1">
            <FileIcon className="h-4 w-4 mr-2" />
            Files
          </TabsTrigger>
          <TabsTrigger value="outline" className="flex-1">
            <List className="h-4 w-4 mr-2" />
            Outline
          </TabsTrigger>
        </TabsList>

        <TabsContent value="files" className="p-0 overflow-auto h-[calc(100vh-96px)]">
          <div className="p-2">{renderFileTree(fileTree)}</div>
        </TabsContent>

        <TabsContent value="outline" className="p-0 overflow-auto h-[calc(100vh-96px)]">
          <div className="p-2">{renderOutline(outline)}</div>
        </TabsContent>
      </Tabs>

      <div
        className="absolute top-0 right-0 w-2 h-full cursor-col-resize hover:bg-highlight-line"
        onMouseDown={handleResizeStart}
        role="separator"
        aria-orientation="vertical"
        aria-label="Resize sidebar"
      />
    </div>
  )
}
