import React, { useState } from 'react';
import { Box, Button, FormControl, TextField, InputLabel, MenuItem, Modal, Select, Typography } from '@mui/material';
import { FileType } from '../router/pages/files';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import PrintIcon from '@mui/icons-material/Print';
import VisibilityIcon from '@mui/icons-material/VisibilityOutlined';

type DocViewerProps = {
    fileInfo: FileType
    onRemove: () => void
};

type Resolution = '300dpi' | '600dpi' | '601x600dpi' | '602x600dpi' | '603x600dpi' | '604x600dpi' | '605x600dpi' | '606x600dpi' | '607x600dpi';

function getInitialResolution(): Resolution {
    const resolution = localStorage.getItem('print-resolution');
    return resolution === null ? '601x600dpi' : JSON.parse(resolution) as Resolution;
}

const DocViewer: React.FC<DocViewerProps> = (props) => {
    const { fileInfo, onRemove } = props;

    const [open, setOpen] = useState(false);
    const [resolution, setResolution] = useState<Resolution>(getInitialResolution());
    const [pages, setPages] = useState('');
    const [copyNum, setCopyNum] = useState('1');

    const deleteFile = async () => {
        await fetch(`/api/remove_print?name=${fileInfo.name}`);
        setOpen(false);
        onRemove();
    };

    const downloadFile = () => {
        const link = document.createElement('a');
        link.download = fileInfo.name;
        link.href = fileInfo.path;
        link.click();
        link.remove();
    };

    const printFile = () => {
        setOpen(false);
        fetch(`/api/print?name=${fileInfo.name}&timestamp=${Date.now()}&pages=${pages}&resolution=${resolution}&copy_num=${copyNum}`);
    };

    return <>
        <Typography
            variant="body2"
            sx={{mt: 2}}
            onClick={() => setOpen(true)}
        >
            {fileInfo.name}
            <VisibilityIcon onClick={() => setOpen(true)} sx={{
                cursor: 'pointer',
                ml: 1,
                position: 'relative',
                top: '6px',
                ':hover': {
                    opacity: 0.6,
                },
            }} />
        </Typography>
        <Modal
            open={open}
            onClose={() => setOpen(false)}
        >
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 'fit-content',
                bgcolor: '#ffffff',
                boxShadow: 24,
                p: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                outline: 'none',
                borderRadius: '12px',
            }}>
                <Box sx={{display: 'flex'}}>
                    <iframe src={fileInfo.path} width={1200} height={700} />
                    <Box ml={8} width="280px">
                        <Typography mb={4} textAlign="center" variant="h6">Настройки печати</Typography>
                        <FormControl sx={{width: '240px', mt: 4}}>
                            <InputLabel id="resolution">Качество</InputLabel>
                            <Select
                                value={resolution}
                                label="Качество"
                                labelId="resolution"
                                onChange={(event) => {
                                    const value = event.target.value as Resolution;
                                    setResolution(value);
                                    localStorage.setItem('resolution', JSON.stringify(value));
                                }}
                            >
                                <MenuItem value="300dpi">300 DPI</MenuItem>
                                <MenuItem value="600dpi">600 DPI</MenuItem>
                                <MenuItem value="601x600dpi">601x600 DPI</MenuItem>
                                <MenuItem value="602x600dpi">602x600 DPI</MenuItem>
                                <MenuItem value="603x600dpi">603x600 DPI</MenuItem>
                                <MenuItem value="604x600dpi">604x600 DPI</MenuItem>
                                <MenuItem value="605x600dpi">605x600 DPI</MenuItem>
                                <MenuItem value="606x600dpi">606x600 DPI</MenuItem>
                                <MenuItem value="607x600dpi">607x600 DPI</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl sx={{width: '240px', mt: 4}}>
                            <TextField
                                type="text"
                                value={pages}
                                variant="filled"
                                label="Странички"
                                onChange={(event) => setPages(event.target.value)}
                            />
                        </FormControl>
                        <FormControl sx={{width: '240px', mt: 4}}>
                            <TextField
                                type="number"
                                value={copyNum}
                                variant="filled"
                                label="Количество копий"
                                onChange={(event) => setCopyNum(event.target.value)}
                            />
                        </FormControl>
                    </Box>
                </Box>
                <Box sx={{display: 'flex', justifyContent: 'center', gap: '32px', mt: 4}}>
                    <Button
                        size="large"
                        color="primary"
                        variant="contained"
                        onClick={printFile}
                        startIcon={<PrintIcon />}
                    >
                        Печатать
                    </Button>
                    <Button
                        size="large"
                        color="success"
                        variant="contained"
                        onClick={downloadFile}
                        startIcon={<DownloadIcon />}
                    >
                        Скачать
                    </Button>
                    <Button
                        size="large"
                        color="error"
                        variant="contained"
                        onClick={deleteFile}
                        startIcon={<DeleteIcon />}
                    >
                        Удалить
                    </Button>
                </Box>
            </Box>
        </Modal>
    </>
};

export default DocViewer;