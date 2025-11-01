import { UseWorldClock } from "@/context/WorldClockContext";
import { FiSun } from "react-icons/fi";
import { IoIosArrowRoundForward } from "react-icons/io";
import { MdOutlineModeNight } from "react-icons/md";
import { Link } from "react-router-dom";
import Skeleton from "../ui/Skeleton";

const MiniWorldClock = () => {
	const { currentRegion, timeZones } = UseWorldClock();

	return (
		<div className='flex items-center gap-5 flex-wrap'>
			<div>
				<div className='flex items-center gap-2'>
					<p className='font-bold text-xs'>Current City:</p>
					<h1 className='font-bold'>{currentRegion?.city ?? ""}</h1>
				</div>
				<h1 className='font-bold text-[1.2rem]'>{currentRegion?.date ?? ""}</h1>
				<div className='flex items-end  gap-2'>
					<h1 className='font-black text-[4rem] leading-none'>
						{currentRegion?.time ?? ""}
					</h1>
					<span className='text-[1.5rem] font-black'>
						{currentRegion?.ampm ?? ""}
					</span>
				</div>
			</div>
			{timeZones.slice(1, 3).map((zone, index) => (
				<div
					key={index}
					className={`p-4 pt-6 border border-foreground/50 rounded-lg flex flex-col gap-5 cursor-default relative w-full md:w-fit ${
						zone.active
							? "bg-foreground text-background font-bold"
							: "font-medium"
					}`}>
					<div className='flex justify-between items-center gap-5 text-sm'>
						<h3 className='break-all'>{zone.city}</h3>
						<p>{zone.timezone}</p>
					</div>
					{zone.time ? (
						<>
							<div className='flex justify-center items-end gap-1 font-bold'>
								<h3 className='text-[3rem] leading-none'>{zone.time}</h3>
								<span className='text-lg font-semibold mb-1'>{zone.ampm}</span>
							</div>
							<div className='flex justify-between items-center gap-3 text-sm'>
								<span>{zone.date}</span>
								<span className='flex items-center gap-1'>
									{zone.timeOfDay === "day" ? (
										<>
											<FiSun />
											<span className='capitalize'>{zone.timeOfDay}</span>
										</>
									) : (
										<>
											<MdOutlineModeNight className='rotate-45' />
											<span className='capitalize'>{zone.timeOfDay}</span>
										</>
									)}
								</span>
							</div>
						</>
					) : (
						<Skeleton />
					)}
				</div>
			))}
			<div>
				<Link
					to='/dashboard/world-clock'
					className='flex items-center justify-center gap-2 text-sm font-medium cursor-pointer bg-black text-white border-foreground border py-3 px-6 rounded-full w-fit h-fit active:scale-95 transition-all duration-500 ease-in-out'>
					<span>See more</span>
					<IoIosArrowRoundForward className='text-xl' />
				</Link>
			</div>
		</div>
	);
};

export default MiniWorldClock;
