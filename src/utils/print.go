package utils

import (
	"bytes"
	"fmt"
	"os/exec"
)

type PrintFileOptions struct {
	FileName  string
	Pages     string
	CopiesNum int
}

func PrintFile(options PrintFileOptions) error {
	args := []string{
		"-o print-quality=5",
		"-o outputorder=reverse",
		"-o media=A4",
		"-o Resolution=600dpi",
		fmt.Sprintf("-n %d", options.CopiesNum),
	}

	switch options.Pages {
	case "":
	case "odd":
		args = append(args, "-o page-set=odd")
	case "even":
		args = append(args, "-o page-set=even")
	default:
		args = append(args, fmt.Sprintf("-o page-ranges=\"%s\"", options.Pages))
	}

	args = append(args, "--")
	args = append(args, options.FileName)

	cmd := exec.Command("lp", args...)
	var stderr bytes.Buffer
	cmd.Stderr = &stderr
	fmt.Println("INFO", cmd.String())

	err := cmd.Run()
	if err != nil {
		fmt.Println("ERROR", stderr.String(), err.Error())
	}

	return err
}
