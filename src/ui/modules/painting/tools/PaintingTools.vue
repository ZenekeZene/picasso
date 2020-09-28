<template>
  <ol
    class="tools --left"
    @mouseleave="setToolsVisible({ toolsVisible: true })"
  >
    <ColorsTool
      :toolsVisible="toolsVisible"
      @click.native="setToolsVisible({ toolsVisible: true })"
    />
    <StrokeTool
      :toolsVisible="toolsVisible"
      @click.native="setToolsVisible({ toolsVisible: true })"
    />
    <BrushTool
      :toolsVisible="toolsVisible"
      @click.native="setToolsVisible({ toolsVisible: true })"
    />
    <UndoTool @clearCanvas="clearCanvas" />
    <DownloadTool :downloadURI="dataURI" />
    <CleanTool @clearCanvas="clearCanvas" />
  </ol>
</template>
<script>
import { mapState, mapMutations } from 'vuex';
import BrushTool from './BrushTool';
import CleanTool from './CleanTool';
import ColorsTool from './ColorsTool';
import DownloadTool from './DownloadTool';
import StrokeTool from './StrokeTool';
import UndoTool from './UndoTool';
import UploadTool from './UploadTool';

export default {
  name: 'PaintingTools',
  components: {
    BrushTool,
    CleanTool,
    ColorsTool,
    DownloadTool,
    StrokeTool,
    UndoTool,
    UploadTool,
  },
  props: {
    dataURI: {
      type: String,
      default: ''
    },
  },
  computed: {
    ...mapState(['canvas']),
    ...mapState('status', ['toolsVisible']),
  },
  methods: {
    ...mapMutations(['clearCanvas']),
    ...mapMutations('status', [
			'setModeToEditable',
			'setPlayingStatus',
			'setToolsVisible',
		]),
  }
}
</script>