package Integrador.Pasteleria.dto;

public class UserStatsDTO {
    private long totalUsers;
    private String lastUser;
    private String lastUserDate;

    public UserStatsDTO() {
    }

    public UserStatsDTO(long totalUsers, String lastUser, String lastUserDate) {
        this.totalUsers = totalUsers;
        this.lastUser = lastUser;
        this.lastUserDate = lastUserDate;
    }

    public long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public String getLastUser() {
        return lastUser;
    }

    public void setLastUser(String lastUser) {
        this.lastUser = lastUser;
    }

    public String getLastUserDate() {
        return lastUserDate;
    }

    public void setLastUserDate(String lastUserDate) {
        this.lastUserDate = lastUserDate;
    }
}
