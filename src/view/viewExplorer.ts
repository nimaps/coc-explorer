import { Explorer } from '../explorer';
import { BaseTreeNode, ExplorerSource } from '../source/source';
import { flatten } from '../util';

export class ViewExplorer {
  currentLineIndex = 0;

  constructor(public readonly explorer: Explorer) {}

  get flattenedNodes() {
    return flatten(this.explorer.sources.map((s) => s.view.flattenedNodes));
  }

  async refreshLineIndex() {
    const win = await this.explorer.win;
    if (win) {
      const cursor = await win.cursor;
      this.currentLineIndex = cursor[0] - 1;
    }
  }

  async currentSource(): Promise<
    ExplorerSource<BaseTreeNode<any>> | undefined
  > {
    return this.explorer.sources[await this.currentSourceIndex()];
  }

  async currentSourceIndex() {
    const lineIndex = this.currentLineIndex;
    return this.explorer.sources.findIndex(
      (source) =>
        lineIndex >= source.view.startLineIndex &&
        lineIndex < source.view.endLineIndex,
    );
  }

  async currentNode() {
    const source = await this.currentSource();
    if (source) {
      const nodeIndex = this.currentLineIndex - source.view.startLineIndex;
      return source.view.flattenedNodes[nodeIndex] as
        | BaseTreeNode<any, string>
        | undefined;
    }
  }
}
