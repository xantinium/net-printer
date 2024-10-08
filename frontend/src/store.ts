import { action, makeObservable, observable } from 'mobx';
import { toaster } from '@gravity-ui/uikit/toaster-singleton-react-18';
import { httpClient } from './http';
import { FileItem } from './http/files';

type SelectedFile = {
    name: string;
    content: ArrayBuffer;
};

export class AppStore {
    @observable
    private selectedFile: SelectedFile | null;

    @observable
    private files: FileItem[];

    constructor() {
        this.selectedFile = null;
        this.files = [];

        this.reloadFiles();

        makeObservable(this);
    }

    getFiles = () => this.files;

    hasSelectedFile = () => this.selectedFile !== null;

    @action.bound
    async scan() {
        const response = await httpClient.scan();
        if (response instanceof Error) {
            toaster.add({
                name: 'scan',
                theme: 'danger',
                isClosable: true,
                title: response.name,
                content: response.message,
            });
            return;
        }

        this.reloadFiles();
    }

    @action.bound
    onFileChange(filename: string, content: ArrayBuffer) {
        this.selectedFile = {
            name: filename,
            content,
        };

        this.uploadFile();
    }

    @action.bound
    async removeFile(id: string) {
        const response = await httpClient.removeFile(id);
        if (response instanceof Error) {
            toaster.add({
                name: 'remove_file',
                theme: 'danger',
                isClosable: true,
                title: response.name,
                content: response.message,
            });
            return;
        }

        this.setFiles(this.files.filter((file) => file.id !== id));
    }

    @action.bound
    private setFiles(files: FileItem[]) {
        this.files = files;
    }

    @action.bound
    private async reloadFiles() {
        const response = await httpClient.getFiles();
        if (response instanceof Error) {
            toaster.add({
                name: 'get_files',
                theme: 'danger',
                isClosable: true,
                title: response.name,
                content: response.message,
            });
            return;
        }

        this.setFiles(response);
    }

    @action.bound
    private resetSelectedFile() {
        this.selectedFile = null;
    }

    @action.bound
    private async uploadFile() {
        if (!this.selectedFile) {
            return;
        }

        const response = await httpClient.uploadFile(this.selectedFile.name, this.selectedFile.content);
        this.resetSelectedFile();

        if (response instanceof Error) {
            toaster.add({
                name: 'upload_file',
                theme: 'danger',
                isClosable: true,
                title: response.name,
                content: response.message,
            });
            return;
        }

        this.reloadFiles();
    }
}
