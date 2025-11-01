import MiniWorldClock from "@/components/Dashboard/MiniWorldClock";
import Skeleton from "@/components/ui/Skeleton";
import { UserAuth } from "@/context/AuthContext";
import { UseWorldClock } from "@/context/WorldClockContext";

const HomeScreen = () => {
	const { user } = UserAuth();
	const { timeZones } = UseWorldClock();

	const firstName = user?.first_name;
	const fullName = user?.full_name;

	return (
		<div className='pr-4'>
			<div className='flex flex-col gap-1 mb-6'>
				<h1 className='text-2xl font-bold'>
					Welcome back,{" "}
					{firstName ||
						(typeof fullName === "string"
							? fullName.split(" ")[0]
							: undefined) ||
						user?.email}
					👋
				</h1>
				<p className='text-xs'>Here is your workspace overview.</p>
			</div>
			{timeZones.length === 0 ? (
				<Skeleton />
			) : (
				<div className='mb-4 py-4 px-6 border border-foreground/20 w-fit rounded-[20px] shadow-lg'>
					<MiniWorldClock />
				</div>
			)}
		</div>
	);
};

export default HomeScreen;
