import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import Sidebar from "../Sidebar/SideBar"
import Editor from "../Editor/Editor"

const Resizable = () => {
  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel style={{ minWidth: '200px' }} >
        <Sidebar />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel>
        <Editor />
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}

export default Resizable;