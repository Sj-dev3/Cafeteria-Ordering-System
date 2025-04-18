import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import LoadingButton from '@/components/ui/LoadingButton';
import { Button } from '@/components/ui/button';
import { User } from '@/types';
import { useEffect } from 'react';

const formSchema = z.object({
    email: z.string().optional(),
    name: z.string().min(1, { message: 'Name is required' }),
    addressLine1: z.string().min(1, { message: 'Address is required' }),
    city: z.string().min(1, { message: 'City is required' }),
    country: z.string().min(1, { message: 'Country is required' }),
});

type UserFormData = z.infer<typeof formSchema>;

type Props = {
    onSave: (userProfileData: UserFormData) => void;
    isLoading?: boolean;
    currentUser: User;
}

const UserProfileForm = ({ onSave, isLoading, currentUser }: Props) => {
    const form = useForm<UserFormData>({
        resolver: zodResolver(formSchema),
        defaultValues: currentUser,
    });

    useEffect(() => {
        form.reset(currentUser);
    }, [currentUser, form]);

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSave)} className="space-y-4 bg-gray-50 p-4 rounded-md shadow-md">
                <div>
                    <h2 className= "text-2xl font-bold text-gray-900">User Profile Form</h2>
                    <FormDescription>
                        View and change your profile information.
                    </FormDescription>
                </div>

                <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem>
                        <label className="text-gray-700">Email</label>
                        <FormControl>
                            <Input {...field} disabled className="bg-white" />
                        </FormControl>
                    </FormItem>
                )} />

                <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem>
                        <label className="text-gray-700">Name</label>
                        <FormControl>
                            <Input {...field} placeholder="Enter your name" className="bg-white" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )} />

                <div className="flex flex-col md:flex-row gap-4">
                    <FormField control={form.control} name="addressLine1" render={({ field }) => (
                        <FormItem>
                            <label className="text-gray-700">Address</label>
                            <FormControl>
                                <Input {...field} placeholder="Enter your address" className="bg-white" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />

                    <FormField control={form.control} name="city" render={({ field }) => (
                        <FormItem>
                            <label className="text-gray-700">City</label>
                            <FormControl>
                                <Input {...field} placeholder="Enter your city" className="bg-white" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                
                    <FormField control={form.control} name="country" render={({ field }) => (
                        <FormItem>
                            <label className="text-gray-700">Country</label>
                            <FormControl>
                                <Input {...field} placeholder="Enter your country" className="bg-white" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                </div>
                    {isLoading ? <LoadingButton /> : <Button type="submit" className="bg-orange-500">
                    Submit
                    </Button>}
            </form>
        </Form>

    );
}
export default UserProfileForm;