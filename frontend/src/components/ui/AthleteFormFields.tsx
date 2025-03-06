import { Input, NativeSelect, Grid, GridItem, VStack } from "@chakra-ui/react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import {AthleteCreate} from "../../client";
import {Field} from "./field"
// import { Button } from "@chakra-ui/react"
// import { ToggleTip } from "@/components/ui/toggle-tip"
// import { LuInfo } from "react-icons/lu"
interface AthleteFormFieldsProps {
    register: UseFormRegister<AthleteCreate>;
    errors: FieldErrors<AthleteCreate>;
}

const AthleteFormFields = ({ register, errors }: AthleteFormFieldsProps) => {
    return (
        <Grid templateColumns="repeat(2, 1fr)" gap={4}>
            <GridItem>
                <VStack gap={4}>
                    {/* 姓名 */}
                    <Field required invalid={!!errors.name} errorText={errors.name?.message} label="姓名">
                        <Input
                            id="name"
                            {...register("name", { required: "姓名是必填项。" })}
                            placeholder="姓名"
                            type="text"
                        />
                    </Field>

                    {/* 性别 */}
                    <Field required invalid={!!errors.gender} errorText={errors.gender?.message} label="性别">
                        {/*<Input*/}
                        {/*    id="gender"*/}
                        {/*    {...register("gender", { required: "性别是必填项。" })}*/}
                        {/*    placeholder="性别"*/}
                        {/*    type="text"*/}
                        {/*/>*/}
                        <NativeSelect.Root>
                            <NativeSelect.Field id="gender" {...register("gender", { required: "性别是必填项。" })}>
                                <option value="男">男</option>
                                <option value="女">女</option>
                            </NativeSelect.Field>
                            <NativeSelect.Indicator />
                        </NativeSelect.Root>
                    </Field>

                    {/* 身份证号 */}
                    <Field required invalid={!!errors.id_number} errorText={errors.id_number?.message} label="身份证号">
                        <Input
                            id="id_number"
                            {...register("id_number", { required: "身份证号是必填项。" })}
                            placeholder="身份证信息用于打印证书"
                            type="text"
                        />
                    </Field>

                    {/* 运动员级别 */}
                    <Field required invalid={!!errors.kumite_category} errorText={errors.kumite_category?.message} label="运动员级别">
                        <NativeSelect.Root>
                            <NativeSelect.Field id="kumite_category" {...register("kumite_category", { required: "请选择运动员级别。" })}>
                                <option value="甲组">甲组</option>
                                <option value="乙组">乙组</option>
                                <option value="丙组">丙组</option>
                            </NativeSelect.Field>
                            <NativeSelect.Indicator />
                        </NativeSelect.Root>
                    </Field>

                    {/* 竞技个人 */}
                    <Field required invalid={!!errors.kumite_individual} errorText={errors.kumite_individual?.message} label="竞技个人">
                        <NativeSelect.Root>
                            <NativeSelect.Field id="kumite_individual" {...register("kumite_individual", { required: "竞技个人级别。" })}>
                                <option value="-55kg">-55kg</option>
                                <option value="-59kg">-59kg</option>
                                <option value="-63kg">-63kg</option>
                                <option value="-67kg">-67kg</option>
                                <option value="-71kg">-71kg</option>
                                <option value="-75kg">-75kg</option>
                                <option value="-79kg">-79kg</option>
                                <option value="+79kg">+79kg</option>
                                <option value="不参加">不参加</option>
                            </NativeSelect.Field>
                            <NativeSelect.Indicator />
                        </NativeSelect.Root>
                    </Field>
                </VStack>
            </GridItem>

            <GridItem>
                <VStack gap={4}>
                    {/* 团体竞技 */}
                    <Field required invalid={!!errors.kumite_team} errorText={errors.kumite_team?.message} label="团体竞技">
                        <NativeSelect.Root>
                            <NativeSelect.Field id="kumite_team" {...register("kumite_team", { required: "团体竞技必填" })}>
                                <option value="团体1组">团体1组</option>
                                <option value="团体2组">团体2组</option>
                                <option value="不参加">不参加</option>
                            </NativeSelect.Field>
                            <NativeSelect.Indicator />
                        </NativeSelect.Root>
                    </Field>

                    {/* 个人型 */}
                    <Field required invalid={!!errors.individual_kata} errorText={errors.individual_kata?.message} label="个人型">
                        <NativeSelect.Root>
                            <NativeSelect.Field id="individual_kata" {...register("individual_kata", { required: "个人型必填" })}>
                                <option value="平安二段">平安二段</option>
                                <option value="平安三段">平安三段</option>
                                <option value="拔塞大 Bassai Dai">拔塞大 Bassai Dai</option>
                                <option value="不参加">不参加</option>
                            </NativeSelect.Field>
                            <NativeSelect.Indicator />
                        </NativeSelect.Root>
                    </Field>

                    {/* 混双型 */}
                    <Field required invalid={!!errors.mixed_double_kata} errorText={errors.mixed_double_kata?.message} label="混双型">
                        <NativeSelect.Root>
                            <NativeSelect.Field id="mixed_double_kata" {...register("mixed_double_kata", { required: "混双型必填" })}>
                                <option value="一队">混双型一队</option>
                                <option value="二队">混双型二队</option>
                                <option value="不参加">不参加</option>
                            </NativeSelect.Field>
                            <NativeSelect.Indicator />
                        </NativeSelect.Root>
                    </Field>

                    {/* 团体型 */}
                    <Field required invalid={!!errors.team_kata} errorText={errors.team_kata?.message} label="团体型">
                        {/*<ToggleTip content="This is some additional information.">*/}
                        {/*    <Button size="xs" variant="ghost">*/}
                        {/*        <LuInfo />*/}
                        {/*    </Button>*/}
                        {/*</ToggleTip>*/}
                        <NativeSelect.Root>
                            <NativeSelect.Field id="team_kata" {...register("team_kata", { required: "团体型必填" })}>
                                <option value="一队">团体型一队</option>
                                <option value="二队">团体型二队</option>
                                <option value="不参加">不参加</option>
                            </NativeSelect.Field>
                            <NativeSelect.Indicator />
                        </NativeSelect.Root>
                    </Field>

                    {/* 混合团体型 */}
                    <Field required invalid={!!errors.mixed_team_kata} errorText={errors.mixed_team_kata?.message} label="混合团体型">
                        <NativeSelect.Root>
                            <NativeSelect.Field id="mixed_team_kata" {...register("mixed_team_kata", { required: "混合团体型必填" })}>
                                <option value="一队">混合团体型一队</option>
                                <option value="二队">混合团体型二队</option>
                                <option value="不参加">不参加</option>
                            </NativeSelect.Field>
                            <NativeSelect.Indicator />
                        </NativeSelect.Root>
                    </Field>
                </VStack>
            </GridItem>
        </Grid>
    );
};

export default AthleteFormFields;