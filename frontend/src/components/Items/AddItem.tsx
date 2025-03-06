import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, SubmitHandler } from "react-hook-form";
import {
    Button,
    DialogActionTrigger,
    DialogTitle,
    Text,
    HStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { FaPlus,FaDownload } from "react-icons/fa";
import {AthleteCreate, AthletesService, DownloadService} from "@/client";
import type { ApiError } from "@/client/core/ApiError";
import useCustomToast from "@/hooks/useCustomToast";
import { handleError } from "@/utils";

import {
    DialogBody,
    DialogCloseTrigger,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogRoot,
    DialogTrigger,
} from "../ui/dialog";
import AthleteFormFields from "@/components/ui/AthleteFormFields.tsx";

const AddAthlete = () => {
    const [isOpen, setIsOpen] = useState(false);
    const queryClient = useQueryClient();
    const [isDownloading, setIsDownloading] = useState(false);
    const { showSuccessToast, showErrorToast } = useCustomToast();


    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isValid, isSubmitting },
    } = useForm<AthleteCreate>({
        mode: "onBlur",
        criteriaMode: "all",
        defaultValues: {
            name: "",
            gender: "男",
            id_number: "",
            kumite_category: "甲组",
            kumite_individual: "不参加",
            kumite_team: "不参加",
            individual_kata: "不参加",
            team_kata: "不参加",
            mixed_double_kata: "不参加",
            mixed_team_kata: "不参加",
        },
    });

    const mutation = useMutation({
        mutationFn: (data: AthleteCreate) =>
            AthletesService.createAthlete({ requestBody: data }),
        onSuccess: () => {
            showSuccessToast("运动员创建成功。");
            reset();
            setIsOpen(false);
        },
        onError: (err: ApiError) => {
            handleError(err);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["items"] });
        },
    });

    const onSubmit: SubmitHandler<AthleteCreate> = (data) => {
        console.log("提交的数据:", data);
        mutation.mutate(data);
    };
    const handleDownload = async () => {
        setIsDownloading(true);
        try {
            const response = await DownloadService.downloadRegistrationForm();

            // 假设 response 是一个 Blob 对象
            const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = '运动员报名表.xlsx'; // 或者使用服务器返回的文件名
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);

            showSuccessToast("报名表下载成功");
        } catch (error) {
            handleError(error);
            showErrorToast("下载失败", "无法下载报名表，请稍后重试。");
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <HStack my={4} spacing={4}>
            <DialogRoot
                size={{ base: "sm", md: "xl" }}
                placement="center"
                open={isOpen}
                onOpenChange={({ open }) => setIsOpen(open)}
            >
                <DialogTrigger asChild>
                    <Button value="add-Athlete" my={4}>
                        <FaPlus fontSize="16px" />
                        添加运动员
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <DialogHeader>
                            <DialogTitle>添加运动员</DialogTitle>
                        </DialogHeader>
                        <DialogBody>
                            <Text mb={4}>填写以下详细信息以添加新运动员。</Text>
                            <AthleteFormFields register={register} errors={errors} />
                        </DialogBody>
                        <DialogFooter gap={2}>
                            <DialogActionTrigger asChild>
                                <Button variant="subtle" colorPalette="gray" disabled={isSubmitting}>
                                    取消
                                </Button>
                            </DialogActionTrigger>
                            <Button variant="solid" type="submit" disabled={!isValid} loading={isSubmitting}>
                                保存
                            </Button>
                        </DialogFooter>
                    </form>
                    <DialogCloseTrigger />
                </DialogContent>
            </DialogRoot>

            <Button onClick={handleDownload}>
                <FaDownload fontSize="16px" />
                下载报名表
            </Button>
        </HStack>
    );
};

export default AddAthlete;